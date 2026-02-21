interface EspnLeagueEndpoints {
  scoreboard: string;
  standings?: string | string[];
  stats: string;
}

export const ESPN_ENDPOINTS = {
  nfl: {
    scoreboard:
      "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",
    standings: "https://cdn.espn.com/core/nfl/standings?xhr=1",
    stats: "https://cdn.espn.com/core/nfl/game?xhr=1&gameId=",
  },
  cfb: {
    scoreboard:
      "https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard",
    standings: "https://cdn.espn.com/core/college-football/standings?xhr=1",
    stats: "https://cdn.espn.com/core/college-football/game?xhr=1&gameId=",
  },
  nhl: {
    scoreboard:
      "https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard",
    standings: [
      "https://site.api.espn.com/apis/v2/sports/hockey/nhl/standings?type=0&level=3&sort=playoffseed:asc,points:desc,gamesplayed:asc,rotwins:desc",
      "https://site.api.espn.com/apis/v2/sports/hockey/nhl/standings",
      "https://cdn.espn.com/core/nhl/standings?xhr=1&seasontype=3",
      "https://cdn.espn.com/core/nhl/standings?xhr=1&seasonType=3",
      "https://cdn.espn.com/core/nhl/standings?xhr=1&type=3",
      "https://cdn.espn.com/core/nhl/standings?xhr=1&view=wild-card",
      "https://cdn.espn.com/core/nhl/standings?xhr=1",
    ],
    stats:
      "https://site.web.api.espn.com/apis/site/v2/sports/hockey/nhl/summary?event=",
  },
  mls: {
    scoreboard:
      "https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard",
    standings: [
      "https://site.api.espn.com/apis/v2/sports/soccer/usa.1/standings",
      "https://cdn.espn.com/core/soccer/standings?xhr=1&league=usa.1",
    ],
    stats:
      "https://site.web.api.espn.com/apis/site/v2/sports/soccer/usa.1/summary?event=",
  },
} as const satisfies Record<string, EspnLeagueEndpoints>;

export type EspnLeagueId = keyof typeof ESPN_ENDPOINTS;

export function isEspnLeagueId(value: string): value is EspnLeagueId {
  return value in ESPN_ENDPOINTS;
}

export function getStandingsEndpoint(league: EspnLeagueId): string | undefined {
  const endpoint = ESPN_ENDPOINTS[league];
  if (!("standings" in endpoint) || !endpoint.standings) {
    return undefined;
  }
  return Array.isArray(endpoint.standings)
    ? endpoint.standings[0]
    : endpoint.standings;
}

export function getStandingsEndpoints(league: EspnLeagueId): string[] {
  const endpoint = ESPN_ENDPOINTS[league];
  if (!("standings" in endpoint) || !endpoint.standings) {
    return [];
  }
  return Array.isArray(endpoint.standings)
    ? endpoint.standings
    : [endpoint.standings];
}

export const ODDS_ENDPOINT =
  "https://sports.core.api.espn.com/v2/sports/football/leagues/";
