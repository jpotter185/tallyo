import { fetchEspnData } from "./espn/client";
import { getGamesFromJson } from "./espn/transformers";

export async function getCfbGames(week: string) {
  const data = await fetchEspnData("cfb", week);
  const dataWeek = data.week.number;
  const games = getGamesFromJson(data);
  return { games, dataWeek };
}

export async function getNflGames(week: string) {
  const data = await fetchEspnData("nfl", week);
  const dataWeek = data.week.number;
  const games = getGamesFromJson(data);
  return { games, dataWeek };
}
