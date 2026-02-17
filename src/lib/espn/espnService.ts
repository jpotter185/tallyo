import StandingsService from "../service/StandingsService";
import StatsService from "../service/StatsService";
import {
  ESPN_ENDPOINTS,
  EspnLeagueId,
  getStandingsEndpoint,
  isEspnLeagueId,
} from "./enums/espnEndpoints";
// import getCleanedOdds from "./mappers/oddsMapper";
import { LeagueId } from "../leagues/leagueConfig";
import getStandings from "./mappers/standingsMapper";
import mapStats from "./mappers/statsMapper";

const parseStatsByLeague: Record<
  EspnLeagueId,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (payload: any) => { leaders: unknown; scoringPlays: unknown }
> = {
  nfl: (payload) => ({
    leaders: payload?.gamepackageJSON?.leaders,
    scoringPlays: payload?.gamepackageJSON?.scoringPlays,
  }),
  cfb: (payload) => ({
    leaders: payload?.gamepackageJSON?.leaders,
    scoringPlays: payload?.gamepackageJSON?.scoringPlays,
  }),
  nhl: (payload) => {
    const onIcePlays = payload?.onIce;
    const scoringPlays =
      Array.isArray(onIcePlays) &&
      Array.isArray(onIcePlays[0]) &&
      Array.isArray(onIcePlays[1])
        ? onIcePlays[0]
            .concat(onIcePlays[1])
            .filter((play) => play?.ScoringPlay)
        : [];
    return {
      leaders: payload?.leaders,
      scoringPlays,
    };
  },
};

export default class EspnService implements StandingsService, StatsService {
  async getStandings(league: LeagueId): Promise<Standings[]> {
    if (!isEspnLeagueId(league)) {
      return [];
    }
    try {
      const standingsEndpoint = getStandingsEndpoint(league);
      if (!standingsEndpoint) {
        return [];
      }
      const response = await fetch(standingsEndpoint);
      const data = await response.json();
      return getStandings(data);
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  async getStats(
    gameId: string,
    league: LeagueId,
  ): Promise<{
    statMap: Map<string, Stat>;
    scoringPlays: ScoringPlay[];
  }> {
    if (!gameId || !isEspnLeagueId(league)) {
      return { statMap: new Map(), scoringPlays: [] };
    }
    const response = await fetch(ESPN_ENDPOINTS[league].stats + gameId, {
      cache: "no-store",
    });
    const responseJson = await response.json();
    const { leaders, scoringPlays } = parseStatsByLeague[league](responseJson);
    return mapStats(leaders, scoringPlays);
  }
}
