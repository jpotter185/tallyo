// Typed URL builders for the app's API routes. Components build request URLs
// here instead of assembling query strings inline.

export function leaguesUrl(): string {
  return "/api/leagues";
}

export function contextUrl(
  league: string,
  mode: "season" | "date",
  timezone: string,
): string {
  const params = new URLSearchParams({ league, mode, timezone });
  return `/api/context?${params}`;
}

export function gamesUrl(options: {
  league: string;
  year?: string;
  seasonType?: string;
  week?: string;
  date?: string;
  timezone?: string;
}): string {
  const params = new URLSearchParams({ league: options.league });
  if (options.year) params.set("year", options.year);
  if (options.seasonType) params.set("seasonType", options.seasonType);
  if (options.week) params.set("week", options.week);
  if (options.date) params.set("date", options.date);
  if (options.timezone) params.set("timezone", options.timezone);
  return `/api/games?${params}`;
}

export function currentGamesUrl(league: string, timezone: string): string {
  const params = new URLSearchParams({ league, timezone });
  return `/api/games/current?${params}`;
}

export function standingsUrl(league: string): string {
  const params = new URLSearchParams({ league });
  return `/api/standings?${params}`;
}

export function gameDetailsUrl(gameId: string): string {
  return `/api/games/${encodeURIComponent(gameId)}/details`;
}
