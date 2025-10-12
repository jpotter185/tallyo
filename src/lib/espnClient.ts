import { fetchEspnData } from "./espn/client";
import { getGamesFromJson } from "./espn/transformers";

export async function getCfbGames(week: string, scoreboardGroup: string) {
  let scoreboardGroupId = "-1";
  if (scoreboardGroup) {
    scoreboardGroupId = scoreboardGroup;
  }
  const data = await fetchEspnData("cfb", week, scoreboardGroupId);
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

export async function getNflGames(week: string) {
  const data = await fetchEspnData("nfl", week);
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
