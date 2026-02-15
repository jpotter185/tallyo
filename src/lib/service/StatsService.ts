import { LeagueId } from "../leagues/leagueConfig";

export default interface StatsService {
  getStats(
    gameId: string,
    league: LeagueId,
  ): Promise<{
    statMap: Map<string, Stat>;
    scoringPlays: ScoringPlay[];
  }>;
}
