export default interface StandingsService {
  getStandings(league: "nfl" | "cfb"): Promise<Standings[]>;
}
