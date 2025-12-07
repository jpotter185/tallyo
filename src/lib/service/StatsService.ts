export default interface StatsService {
  getStats(
    gameId: string,
    league: "nfl" | "cfb",
  ): Promise<{
    statMap: Map<string, Stat>;
    scoringPlays: ScoringPlay[];
  }>;
}
