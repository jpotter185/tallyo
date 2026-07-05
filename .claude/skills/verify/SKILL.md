---
name: verify
description: Launch the Tallyo Next.js frontend against a local backend and drive league flows end-to-end.
---

# Verify Tallyo frontend changes

## Backend dependency

Start the sibling backend first — see
`../tallyo-backend/.claude/skills/verify/SKILL.md` (throwaway Postgres +
`./mvnw spring-boot:run`, ready in ~15s, seeds real ESPN data on boot).

## Launch

`.env.local` points at prod; override with real env vars (they take
precedence over .env files in Next.js):

```bash
BACKEND_URL=http://localhost:8080 API_KEY=<backend key> npm run dev -- --port 3300
```

## Drive

The Next API routes are unauthenticated proxies:

```bash
curl -s localhost:3300/api/leagues                     # league ids from backend metadata
curl -s "localhost:3300/api/games/current?league=<id>&timezone=America/New_York"
curl -s "localhost:3300/api/standings?league=<id>"
curl -s "localhost:3300/api/games/<gameId>/details"
curl -s -o /dev/null -w "%{http_code}" localhost:3300/<league-id>   # SSR page, 200 vs 404
```

## Visual verification (Playwright)

Chromium headless shell is cached at `~/Library/Caches/ms-playwright`
(installed 2026-07-05). In a scratch dir: `npm i playwright`, then drive
`http://localhost:3300/<league>` and screenshot. Standings/games sections
are collapsed by default — click the `CollapsableSection` titles first
(e.g. `page.getByText("World Cup Standings").first().click()` then a
group/conference name). Rows render client-side only after expanding.

## Gotchas

- `/api/games/current` (proxy) returns a bare array, unlike the backend's
  paginated `{content: [...]}` envelope.
- League ids must pass `parseLeagueId` in `src/lib/leagues/leagueConfig.ts`
  (LEAGUE_ID_REGEX) or proxy routes 400 before reaching the backend.
- `npm run gen:api-types` pipes its output through prettier, so the
  generated file matches the committed format and `check:api-contract`
  diffs cleanly. Don't hand-format the file.
