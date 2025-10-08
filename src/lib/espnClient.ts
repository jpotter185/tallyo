import { fetchEspnData } from "./espn/client";
import { getGamesFromJson } from "./espn/transformers";

export async function getCfbGames(week: string) {
  const data = await fetchEspnData("cfb", week);
  return getGamesFromJson(data);
}

export async function getNflGames(week: string) {
  const data = await fetchEspnData("nfl", week);
  return getGamesFromJson(data);
}
