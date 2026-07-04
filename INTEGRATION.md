# Tallyo Frontend ↔ Backend Integration

How this repo (`tallyo`, Next.js UI on Vercel) integrates with the sibling repo
`../tallyo-backend` (Spring Boot + PostgreSQL, deployed via docker-compose behind
`https://api.tallyo.us`).

> As of the `ui-v2` rebuild, the UI is a **pure client of the backend** — the
> frontend no longer calls ESPN directly for anything. All ESPN ingestion
> (scoreboards, box scores, leaders, scoring plays, standings) lives in the
> backend.

## Big picture

```
Browser (SWR hooks in components)
   │  same-origin calls to /api/* (URLs built by src/lib/api/client.ts)
   ▼
Next.js API routes (src/app/api/*)          ← thin proxies via _lib/backendProxy.ts
   │  fetch ${BACKEND_URL}/api/v1/*  with header  x-api-key: ${API_KEY}
   ▼
Spring Boot backend (tallyo-backend)
   │  controller → service → mapper → dto
   ├─ PostgreSQL (games + team stats + leaders + scoring plays,
   │              refreshed by a 20s scheduled job while games are live)
   └─ ESPN APIs (scoreboard + summary ingestion; standings fetched on demand,
                 cached 30 min, never persisted)
```

The frontend has no database and no domain logic of its own; the backend is the
source of truth for game data, league capabilities, standings, and the API
contract.

## Route mapping

| Frontend route (Next) | Backend endpoint | Notes |
|---|---|---|
| `GET /api/games` | `GET /api/v1/games` | Forwards `league`, `year`, `seasonType`, `week`, `date`; unwraps `PageResponse` to `content` |
| `GET /api/games/current` | `GET /api/v1/games/current` | Backend resolves "current" year/seasonType/week/date via `CalendarService` |
| `GET /api/games/{id}/details` | `GET /api/v1/games/{gameId}/details` | Stat leaders + scoring plays, persisted from ESPN summary ingestion |
| `GET /api/context` | `GET /api/v1/games/context` or `/api/v1/games/dates` | `mode=season` → `/context`; `mode=date` → `/dates` |
| `GET /api/leagues` | `GET /api/v1/leagues` | `LeagueMetadata[]` derived from the backend `League` enum |
| `GET /api/standings` | `GET /api/v1/standings` | Standings groups mapped from ESPN by the backend (cache-only, 30-min evict) |

All routes share `src/app/api/_lib/backendProxy.ts`: it injects `x-api-key`,
maps `timezone` → `userTimeZone`, and passes backend errors through untouched.

Backend also exposes `POST /api/v1/games` (admin backfill: re-ingest a
league/year from ESPN, optionally with stats/details) and the deprecated
`GET /api/v1/games/nhl-dates`; the frontend calls neither.

## Authentication & CORS

- Every backend request requires header `x-api-key`; the Next API routes attach
  it server-side from the `API_KEY` env var, so the key never reaches the browser.
- Backend side: `ApiKeyAuthFilter` (registered in `SecurityConfig`) returns a
  403 `ApiError` envelope on mismatch. CORS is locked to `https://tallyo.us`,
  though in normal operation the browser only talks to same-origin Next routes.
- Frontend env vars: `BACKEND_URL` and `API_KEY` (both server-only), plus
  `NEXT_PUBLIC_MAINTENANCE_MODE` for the maintenance-mode middleware
  (`src/proxy.ts`).

## API contract (OpenAPI-driven types)

- **Source of truth:** `../tallyo-backend/openapi.yaml` (hand-maintained,
  currently v1.2.0).
- **Type generation:** `npm run gen:api-types` runs `scripts/generate-api-types.rb`
  against the sibling repo's spec and writes `src/types/api.generated.ts`.
- **App-facing aliases:** `src/types/api-contract.ts` re-exports the generated
  schemas (`Game`, `Team`, `StandingsGroup`, `StandingsTeam`, `GameDetails`,
  `StatLeader`, `ScoringPlay`, `LeagueMetadata`, `CurrentContext`, `ApiError`).
  There are **no hand-written ambient types** — everything types from the
  generated contract.
- **CI enforcement:** the frontend's `contract-check.yml` runs
  `npm run check:api-contract` (regenerate + fail on diff). The backend's CI
  validates the YAML parses and the project compiles but does not diff spec vs
  code — keeping those in sync is manual on the backend side.
- Workflow for a contract change: change backend code + `openapi.yaml` together,
  then run `npm run gen:api-types` here and commit the regenerated types.

## League capability sync

Both repos avoid per-league branching by driving behavior off capability flags
that flow backend → frontend at runtime:

- Backend `enums/League` is the origin: `NFL`, `CFB`, `NHL`, `MLS` with flags
  (`supportsYearFilter`, `supportsWeekFilter`, `supportsStandings`,
  `contextMode` `"season"`/`"date"`, `statsProfile`, `teamOrder`,
  `supportsOdds`, `supportsLiveDetails`) plus the ESPN path segment.
- `GET /api/v1/leagues` serializes the enum to `LeagueMetadata[]`; the frontend
  merges it with local `UI_PRESETS` (season-type labels, week counts, year
  options — nfl/cfb only) and `DEFAULT_LEAGUE_METADATA` fallbacks in
  `src/lib/leagues/leagueConfig.ts`.
- The backend flags are **authoritative** — the old client-side force-enable of
  NHL/MLS standings is gone; those leagues now report `supportsStandings=true`
  from the enum itself.
- Presentation-only maps (team-stat labels per `statsProfile` in
  `src/lib/leagues/statDisplayMaps.ts`, standings column profiles in
  `Standings.tsx`) stay client-side, keyed by backend metadata.

## Timezone handling

1. Components resolve the browser timezone via
   `Intl.DateTimeFormat().resolvedOptions().timeZone`.
2. They pass it to Next routes as `timezone=...` (URL builders in
   `src/lib/api/client.ts`).
3. `backendProxy.ts` forwards it as `userTimeZone=...`.
4. Backend defaults to `America/New_York` when absent and includes the timezone
   in its context cache key.

Any new date-sensitive endpoint must plumb this parameter through all three hops.

## Error contract

A single `ApiError` envelope is shared end to end:
`{ code, message, details?, path?, timestamp? }`.

- Backend `GlobalExceptionHandler`: 400 (invalid request/timezone), 403 (API
  key), 404 `NOT_FOUND` (unknown game id), 502 (ESPN upstream failures),
  500 otherwise.
- Next proxy routes are transparent on errors: non-2xx responses pass the
  backend's raw body and status through unchanged.
- Client-side, `src/lib/api/fetcher.ts` throws an `Error` with `status`,
  `code`, and `details` attached from the envelope.

## Live-update mechanics

- **Backend ingestion:** `GameServiceImpl.updateGamesForToday` runs every 20s
  (`@Scheduled`) and re-fetches ESPN scoreboard + per-game summaries (team
  stats, stat leaders, scoring plays — all from one summary call per game) for
  yesterday+today across all leagues, but only while
  `GameRepository.shouldUpdate()` says a game is live or recently started.
- **Schedule refresh:** `GameServiceImpl.refreshSchedules` runs on startup and
  daily at 4am ET. One scoreboard call per league seeds/updates the current
  year's schedule so the 20s job always has upcoming games to trigger on. It
  only saves games that are new or still awaiting play — merging a
  schedule-only game over an ingested one would orphan-delete its
  stats/leaders/scoring plays, so live and finished games are never touched by
  this path. No manual season seeding needed.
- **Standings:** fetched from ESPN on demand per league with fallback URL
  chains (`espn.standings.urls` in `application.yml`), cached in-memory,
  evicted every 30 minutes. Never persisted.
- **Frontend polling:** the Dashboard polls `/api/games/current` per league at
  10s (filtered by `isLiveDashboardGame`); each expanded game card polls
  `/api/games/{id}/details` at 10s while `shouldPollGameStats` is true.

Worst-case staleness for a live score is roughly backend interval (20s) +
frontend interval (10s).

## Deployment topology

- **Frontend:** Vercel, `https://tallyo.us`.
- **Backend:** push to `main` triggers a GitHub Action that SSHes into the prod
  host (via `cloudflared`) and runs `./deploy.sh` (rebuild jar + recreate the
  docker-compose stack: `app` + `postgres:15` + `dozzle`). Hibernate runs
  `ddl-auto: update`, so the `game_leaders` / `scoring_plays` tables are created
  automatically on first boot after deploy.
- For **local dev**, `deploy.sh` works too with a `.env` present; add a
  `docker-compose.override.yml` publishing `8080:8080` (the prod compose file
  only `expose`s the port to the internal network) and create the external
  `app-network` once (`docker network create app-network`). Point the
  frontend's `.env.local` `BACKEND_URL` at `http://localhost:8080`.
- Historical games ingested before the details feature have no leaders/scoring
  plays; backfill per league/year with
  `POST /api/v1/games?league=X&year=Y&shouldFetchStats=true`. Note that a POST
  with `shouldFetchStats=false` merges games with null child collections and
  therefore wipes existing stats/leaders/scoring plays for the games it
  touches — use `true` unless that's intended.

## Adding a league (cross-repo checklist)

1. **Backend:** add the `League` enum entry (sport, ESPN path value, capability
   flags); add its standings URL(s) under `espn.standings.urls` in
   `application.yml`; verify the ESPN summary shape for the sport in
   `EspnSummaryDetailsMapper` (football/hockey/soccer branches exist today);
   confirm `/games`, `/games/current`, `/context`, `/dates`, `/standings`
   behave.
2. **Contract:** update `openapi.yaml` (at minimum the `league` enum lists).
3. **Frontend:** run `npm run gen:api-types`; add `DEFAULT_LEAGUE_METADATA`
   (and `UI_PRESETS` if season-mode) entries in `leagueConfig.ts`; add a stat
   display map in `statDisplayMaps.ts` if it's a new stats profile. The dynamic
   `[league]` route picks it up with no new routing.
4. **Validate:** `npm run lint && npx tsc --noEmit && npm run build` here;
   `./mvnw -q -DskipTests compile` in the backend.
