import { LeagueId } from "../leagues/leagueConfig";

export default interface GamesService {
  getGames(
    league: LeagueId,
    week?: string,
    scoreboardGroup?: string,
  ): Promise<{
    games: Game[];
    dataWeek: string;
    scoreboardGroupId: string | undefined;
  }>;
}
