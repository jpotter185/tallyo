import GamesService from "../service/GamesService";
import OddsService from "../service/OddsService";
import StandingsService from "../service/StandingsService";
import StatsService from "../service/StatsService";
import { ENDPOINTS } from "./enums/espnEndpoints";
import getGamesFromJson from "./mappers/gameMapper";
import getCleanedOdds from "./mappers/oddsMapper";
import getStandings from "./mappers/standingsMapper";
import mapStats from "./mappers/statsMapper";

export default class EspnService
  implements GamesService, StandingsService, StatsService, OddsService
{
  async getWeek(league: "nfl" | "cfb"): Promise<string> {
    return (await this.getGames(league)).dataWeek;
  }

  async getGames(
    league: "nfl" | "cfb",
    week?: string,
    scoreboardGroupId?: string,
  ): Promise<{
    games: Game[];
    dataWeek: string;
    scoreboardGroupId: string | undefined;
  }> {
    const url = new URL(ENDPOINTS[league]);
    if (week) url.searchParams.set("week", week);
    if (scoreboardGroupId && scoreboardGroupId !== "-1")
      url.searchParams.set("groups", String(scoreboardGroupId));

    try {
      const response = await fetch(url.toString(), { cache: "no-store" });
      const data = await response.json();
      const games = await getGamesFromJson(data, league);

      for (const game of games) {
        const oddsObject: Odds | undefined = await this.getOddsForGame(game);
        if (oddsObject) {
          game.odds = oddsObject;
        }
      }
      const dataWeek = data.week.number;
      let returnedScoreboardGroup = scoreboardGroupId;
      if (league === "cfb" && data.groups) {
        returnedScoreboardGroup = data.groups[0];
      }
      return {
        games,
        dataWeek,
        scoreboardGroupId: returnedScoreboardGroup,
      };
    } catch (error) {
      console.error(error);
      return {
        games: [],
        dataWeek: week || "",
        scoreboardGroupId: scoreboardGroupId,
      };
    }
  }
  async getStandings(league: "nfl" | "cfb"): Promise<Standings[]> {
    try {
      const response = await fetch(ENDPOINTS[`${league}standings`]);
      const data = await response.json();
      return getStandings(data);
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  async getStats(
    gameId: string,
    league: "nfl" | "cfb",
  ): Promise<{
    statMap: Map<string, Stat>;
    scoringPlays: ScoringPlay[];
  }> {
    if (gameId) {
      const response = await fetch(ENDPOINTS[`${league}stats`] + gameId);
      const responseJson = await response.json();
      const leaders = responseJson.gamepackageJSON.leaders;
      const scoringPlays = responseJson.gamepackageJSON.scoringPlays;
      return mapStats(leaders, scoringPlays);
    } else {
      return { statMap: new Map(), scoringPlays: [] };
    }
  }
  async getOdds(
    league: "nfl" | "cfb",
    gameId: string,
  ): Promise<Odds | undefined> {
    const ODDS_API_ENDPOINT =
      ENDPOINTS.odds +
      `${
        league === "nfl" ? "nfl" : "college-football"
      }/events/${gameId}/competitions/${gameId}/odds`;
    try {
      const response = await fetch(ODDS_API_ENDPOINT);
      const data = await response?.json();
      return getCleanedOdds(gameId, data);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  async getOddsForGame(game: Game): Promise<Odds | undefined> {
    const ODDS_API_ENDPOINT =
      ENDPOINTS.odds +
      `${
        game.league === "nfl" ? "nfl" : "college-football"
      }/events/${game.id}/competitions/${game.id}/odds`;
    try {
      const response = await fetch(ODDS_API_ENDPOINT);
      const data = await response?.json();
      return getCleanedOdds(game.id, data, game);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
