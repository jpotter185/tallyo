import { fetchEspnGameData, fetchStandings, getOdds } from "./client";
import {
  defaultCfbGroupId,
  getCleanedOdds,
  getGamesFromJson,
  getStandingsFromJson,
  getStatLeadersForGame,
} from "./transformers";

export async function getCfbGames(
  week: string | undefined,
  scoreboardGroup: string | undefined,
) {
  let scoreboardGroupId = defaultCfbGroupId;
  if (scoreboardGroup) {
    scoreboardGroupId = scoreboardGroup;
  }
  const data = await fetchEspnGameData("cfb", week, scoreboardGroupId);
  if (data) {
    const dataWeek = data.week.number;
    let returnedScoreboardGroupId = scoreboardGroupId;
    if (data.groups) {
      returnedScoreboardGroupId = data.groups[0];
    }
    const games = await getGamesFromJson(data, "cfb");
    return { games, dataWeek, scoreboardGroupId: returnedScoreboardGroupId };
  } else {
    return {
      games: [],
      dataWeek: week,
      scoreboardGroupId: scoreboardGroupId,
    };
  }
}

export async function getNflGames(week: string | undefined) {
  const data = await fetchEspnGameData("nfl", week);
  if (data) {
    const dataWeek = data.week.number;
    const games = await getGamesFromJson(data, "nfl");
    return { games, dataWeek };
  } else {
    return {
      games: [],
      dataWeek: week,
    };
  }
}

export async function getCurrentNflWeek() {
  const data = await fetchEspnGameData("nfl");
  if (data) {
    const dataWeek = data?.week?.number;
    return dataWeek;
  } else {
    return "";
  }
}

export async function getCurrentCfbWeek() {
  const data = await fetchEspnGameData("cfb");
  if (data) {
    const dataWeek = data?.week?.number;
    return dataWeek;
  } else {
    return "";
  }
}

export async function getNflStandings() {
  const data = await fetchStandings("nfl");

  if (data) {
    const standings = getStandingsFromJson(data);
    return standings;
  } else {
    return [];
  }
}

export async function getCfbStandings() {
  const data = await fetchStandings("cfb");

  if (data) {
    const standings = getStandingsFromJson(data);
    return standings;
  } else {
    return [];
  }
}

export async function getNflStatsForGame(gameId: string) {
  return await getStatLeadersForGame("nfl", gameId);
}

export async function getCfbStatsForGame(gameId: string) {
  return await getStatLeadersForGame("cfb", gameId);
}

export async function getOddsForGameId(league: "nfl" | "cfb", gameId: string) {
  const oddsJson = await getOdds(gameId, league);
  if (oddsJson) {
    const odds: Odds = getCleanedOdds(gameId, oddsJson);
    return odds;
  }
  return undefined;
}

export async function getOddsForGameWithGameObject(
  league: "nfl" | "cfb",
  game: Game,
): Promise<Odds | undefined> {
  const oddsJson = await getOdds(game.id, league);
  if (oddsJson) {
    const odds: Odds = getCleanedOdds(
      game.id,
      oddsJson,
      game.final,
      game.homeScore,
      game.awayScore,
    );
    return odds;
  } else {
    return undefined;
  }
}
