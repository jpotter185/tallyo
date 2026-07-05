# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`tallyo` is a Next.js (App Router) UI for viewing sports games with live updates, game details, standings, and league dashboards. Supported leagues: `nfl`, `cfb`, `nhl`, `mls`, `world_cup`. Deployed on Vercel at https://tallyo.us.

The backend is a Spring Boot service in the sibling repo `../tallyo-backend`, which is the source of truth for the API contract (`../tallyo-backend/openapi.yaml`). This repo has no database and no backend logic of its own — it's a thin proxy + presentation layer.

## Commands

- Dev server: `npm run dev` (uses `--turbopack`)
- Build: `npm run build`
- Lint/fix: `npm run lint` (eslint --fix)
- Typecheck: `npx tsc --noEmit`
- Regenerate API types from backend OpenAPI spec: `npm run gen:api-types` (reads `../tallyo-backend/openapi.yaml`, requires the sibling repo checked out; writes `src/types/api.generated.ts`)
- Verify generated types match the OpenAPI contract (used in CI): `npm run check:api-contract`

There is no test suite configured in this repo — validation is lint + typecheck (+ build).

Backend (reference only, in `../tallyo-backend`): `./mvnw -q -DskipTests compile` to compile, `./mvnw test` to test.

## Architecture

### Data flow
UI components call Next.js API routes under `src/app/api/*` (`/api/games`, `/api/games/current`, `/api/games/[gameId]/details`, `/api/context`, `/api/standings`, `/api/leagues`) via SWR. These routes are thin proxies: they read query params, forward the request to `${BACKEND_URL}/api/v1/...` with an `x-api-key` header (`API_KEY` env var), and pass the backend's status/body straight through on error (don't swallow or reshape backend errors — see `src/app/api/games/route.ts` for the pattern). All sports data comes from the backend; this repo makes no direct ESPN calls.

### Key source-of-truth files
- `src/lib/leagues/leagueConfig.ts` — per-league capability flags (`supportsStandings`, `supportsOdds`, `supportsLiveDetails`, `teamOrder`, season/week/year UI options, stats profile). Backend-provided `LeagueMetadata` is merged with local `UI_PRESETS`/`DEFAULT_LEAGUE_METADATA` fallbacks. League ids must match `LEAGUE_ID_REGEX` (lowercase letters, digits, `-`, `_`) — `parseLeagueId` gates both the `[league]` page route and the proxy API routes.
- `src/lib/gameStatus.ts` — single source of truth for scheduled/live/final status logic (`isScheduledGame`, `isInProgressGame`, `isFinalGame`, `isLiveDashboardGame`, etc.). Always use these helpers rather than comparing `gameStatus` strings inline.
- `src/lib/api/fetcher.ts` — shared SWR fetcher; throws on non-2xx and attaches `status`/`code`/`details` from the API error envelope.
- `src/app/[league]/page.tsx` — dynamic league route; works for any league id present in league config, no per-league routing needed.
- `src/components/SportPage.tsx` — main per-league screen implementation.
- `src/proxy.ts` — Next.js middleware; redirects all routes to `/maintenance` when `NEXT_PUBLIC_MAINTENANCE_MODE=true`.

### API contract
- Contract source: `../tallyo-backend/openapi.yaml`.
- Generated types: `src/types/api.generated.ts` (do not hand-edit; regenerate via `npm run gen:api-types`).
- App-facing aliases/shortcuts over the generated types: `src/types/api-contract.ts`.
- Expected API error shape: `{ code: string; message: string; details?: string; path?: string; timestamp?: string }`.
- CI (`.github/workflows/contract-check.yml`) checks generated types are in sync with the OpenAPI spec via `npm run check:api-contract`.

### Timezone handling
The UI resolves the browser's local timezone and passes it to Next API routes as `timezone`; Next routes forward it to the backend as `userTimeZone`. Any new endpoint whose response depends on date boundaries (today's games, current context, etc.) must accept and forward timezone.

### Adding a new sport/league
1. Add the league to `src/lib/leagues/leagueConfig.ts` (`DEFAULT_LEAGUE_METADATA`, and a `UI_PRESETS` entry if it needs season/week/year filtering).
2. No new route needed — the dynamic `[league]` route picks it up once config exists.
3. Add/wire a stats display map in `src/lib/leagues/statDisplayMaps.ts` if the league needs a new stats profile.
4. Add the league on the backend (enum + data fetch support) and confirm `/games`, `/games/current`, `/context`, `/dates` behave as expected.
5. Update `../tallyo-backend/openapi.yaml` if request/response shape changed, then run `npm run gen:api-types`.
6. Validate: `npm run lint && npx tsc --noEmit`.

## Conventions

- Prefer central config (`leagueConfig.ts`) over hardcoded per-league `if (league === "nfl")` branching.
- Prefer the shared helpers in `gameStatus.ts` over re-deriving status/date logic inline.
- Keep proxy API routes transparent on errors — forward the backend's status and body rather than wrapping them.
- Keep `src/types/api-contract.ts` aligned with the OpenAPI-generated types; regenerate rather than hand-editing generated types.
