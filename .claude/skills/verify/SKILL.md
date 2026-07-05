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

## Gotchas

- `/api/games/current` (proxy) returns a bare array, unlike the backend's
  paginated `{content: [...]}` envelope.
- League ids must pass `parseLeagueId` in `src/lib/leagues/leagueConfig.ts`
  (LEAGUE_ID_REGEX) or proxy routes 400 before reaching the backend.
- `src/types/api.generated.ts`: the committed file is prettier-formatted;
  the raw `npm run gen:api-types` output is not. Run
  `npx eslint --fix src/types/api.generated.ts` after regenerating or the
  diff is 300 lines of formatting churn (and `check:api-contract`'s
  raw-diff assumption is broken because of this).
- Repo CLAUDE.md mentions `src/lib/espn/espnService.ts` — that layer no
  longer exists; standings/stats go through the backend proxy now.
