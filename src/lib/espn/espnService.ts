import StandingsService from "../service/StandingsService";
import StatsService from "../service/StatsService";
import {
  ESPN_ENDPOINTS,
  EspnLeagueId,
  getStandingsEndpoints,
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
  mls: (payload) => ({
    leaders: Array.isArray(payload?.leaders) ? payload.leaders : [],
    scoringPlays: Array.isArray(payload?.scoringPlays)
      ? payload.scoringPlays
      : [],
  }),
};

export default class EspnService implements StandingsService, StatsService {
  async getStandings(league: LeagueId): Promise<Standings[]> {
    if (!isEspnLeagueId(league)) {
      return [];
    }
    const standingsEndpoints = getStandingsEndpoints(league);
    if (standingsEndpoints.length === 0) {
      return [];
    }

    for (const standingsEndpoint of standingsEndpoints) {
      try {
        const response = await fetch(standingsEndpoint);
        if (!response.ok) {
          continue;
        }
        const data = await response.json();
        const standings = getStandings(data);
        if (standings.length > 0) {
          return standings;
        }
      } catch (error) {
        console.error(
          `Error loading standings endpoint ${standingsEndpoint}`,
          error,
        );
      }
    }
    return [];
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
