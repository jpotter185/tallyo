export default interface GamesService {
  getGames(
    league: "nfl" | "cfb",
    week?: string,
    scoreboardGroup?: string,
  ): Promise<{
    games: Game[];
    dataWeek: string;
    scoreboardGroupId: string | undefined;
  }>;
}
