import { LeagueId } from "../leagues/leagueConfig";

export default interface StandingsService {
  getStandings(league: LeagueId): Promise<Standings[]>;
}
