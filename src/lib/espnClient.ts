import { fetchEspnData } from "./espn/client";
import { getGamesFromJson } from "./espn/transformers";

export async function getCfbGames(week: string, scoreboardGroup: string) {
  let scoreboardGroupId = "-1";
  if (scoreboardGroup) {
    scoreboardGroupId = scoreboardGroup;
  }
  const data = await fetchEspnData("cfb", week, scoreboardGroupId);
  const dataWeek = data.week.number;
  let returnedScoreboardGroupId = scoreboardGroupId;
  if (data.groups) {
    returnedScoreboardGroupId = data.groups[0];
  }
  const games = getGamesFromJson(data);
  return { games, dataWeek, scoreboardGroupId: returnedScoreboardGroupId };
}

export async function getNflGames(week: string) {
  const data = await fetchEspnData("nfl", week);
  const dataWeek = data.week.number;
  const games = getGamesFromJson(data);
  return { games, dataWeek };
}
