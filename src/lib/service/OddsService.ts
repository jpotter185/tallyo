export default interface OddsService {
  getOdds(league: "nfl" | "cfb", gameId: string): Promise<Odds | undefined>;
  getOddsForGame(game: Game): Promise<Odds | undefined>;
}
