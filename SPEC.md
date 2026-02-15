# Tallyo Specification (Initial)

## 1) Product Scope
- `tallyo` is a Next.js UI for viewing sports games with live updates, game details, standings, and league dashboards.
- Current supported leagues: `nfl`, `cfb`, `nhl`.
- Primary UX goals:
  - Fast loading scoreboard views.
  - Reliable live/in-progress updates.
  - Consistent league-specific filtering (season/week/year vs date).

## 2) High-Level Architecture
- Frontend: Next.js app router (`src/app`) with server API proxy routes (`src/app/api/*`) and client UI components (`src/components/*`).
- Backend: Spring Boot service in sibling repo `../tallyo-backend`.
- Data flow:
  - UI calls Next routes (`/api/games`, `/api/games/current`, `/api/context`, `/api/standings`, `/api/stats`).
  - Next routes proxy to backend + ESPN adapters.
  - Backend serves canonical game/context data from DB and scheduled ESPN ingest.

## 3) Key Source-of-Truth Files
- League capabilities/config: `src/lib/leagues/leagueConfig.ts`
- Game status behavior (scheduled/final/live logic): `src/lib/gameStatus.ts`
- Shared API fetch error handling: `src/lib/api/fetcher.ts`
- Dynamic league page: `src/app/[league]/page.tsx`
- League screen implementation: `src/components/SportPage.tsx`

## 4) API Contract
- Contract source: `../tallyo-backend/openapi.yaml`
- Generated frontend types: `src/types/api.generated.ts`
- Contract aliases used in app code: `src/types/api-contract.ts`
- Regenerate command:
  - `npm run gen:api-types`

## 5) Error Contract
- Expected API error shape:
  - `code: string`
  - `message: string`
  - `details?: string`
  - `path?: string`
  - `timestamp?: string`
- Frontend fetcher throws on non-2xx and attaches status/code/details.

## 6) Timezone Rules
- UI resolves local timezone in browser and passes to Next API routes as `timezone`.
- Next API routes forward timezone to backend as `userTimeZone`.
- Backend context/dates must be timezone-aware.
- Any new endpoint that depends on date boundaries must accept timezone.

## 7) Add a New Sport Checklist
1. Frontend league config:
   - Add league in `src/lib/leagues/leagueConfig.ts`.
2. Frontend routing/nav:
   - Dynamic route already supports new league id if config is present.
3. Frontend stats display:
   - Add relevant stat map and wire in league config.
4. Backend enum/support:
   - Add league in backend `League` enum and data fetch support.
5. Backend API behavior:
   - Ensure `/games`, `/games/current`, `/context`, `/dates` return expected data.
6. Contract update:
   - Update `../tallyo-backend/openapi.yaml` if response/query behavior changed.
7. Regenerate types:
   - Run `npm run gen:api-types`.
8. Validate:
   - Frontend: `npm run lint && npx tsc --noEmit`
   - Backend: `./mvnw -q -DskipTests compile`

## 8) Frontend Commands
- Install deps: `npm install`
- Dev: `npm run dev`
- Lint/fix: `npm run lint`
- Typecheck: `npx tsc --noEmit`
- Build: `npm run build`
- Generate API types: `npm run gen:api-types`

## 9) Backend Commands (Reference)
- Dev/build repo: `../tallyo-backend`
- Compile: `./mvnw -q -DskipTests compile`
- Test: `./mvnw test`

## 10) Current Conventions
- Prefer central config over hardcoded per-league branching.
- Prefer shared helpers over repeated status/date logic.
- Keep UI contract aligned to OpenAPI.
- Keep proxy routes transparent on errors (preserve status/body).

## 11) Known Follow-Ups
- Add CI check to enforce generated types are up to date with OpenAPI.
- Add API integration tests for error envelopes and timezone behavior.
