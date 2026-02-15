import { LeagueId } from "@/lib/leagues/leagueConfig";

interface EspnLeagueEndpoints {
  scoreboard: string;
  standings?: string;
  stats: string;
}

export const ESPN_ENDPOINTS: Record<LeagueId, EspnLeagueEndpoints> = {
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
    stats:
      "https://site.web.api.espn.com/apis/site/v2/sports/hockey/nhl/summary?event=",
  },
};

export const ODDS_ENDPOINT =
  "https://sports.core.api.espn.com/v2/sports/football/leagues/";
