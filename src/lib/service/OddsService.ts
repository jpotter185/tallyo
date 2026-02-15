import { LeagueId } from "../leagues/leagueConfig";

export default interface OddsService {
  getOdds(league: LeagueId, gameId: string): Promise<Odds | undefined>;
  getOddsForGame(game: Game): Promise<Odds | undefined>;
}
