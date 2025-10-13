import { fetchEspnGameData, fetchStandings } from "./espn/client";
import {
  defaultCfbGroupId,
  getGamesFromJson,
  getNflStandingsFromJson,
} from "./espn/transformers";

export async function getCfbGames(
  week: string | undefined,
  scoreboardGroup: string | undefined
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

export async function getNflStandings() {
  const data = await fetchStandings("nfl");

  if (data) {
    const standings = getNflStandingsFromJson(data);
    return standings;
  } else {
    return [];
  }
}
