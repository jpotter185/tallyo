import { getCollegeGames, getNflGames } from "@/lib/espnClient";

export async function getCollegeFootballGames() {
  return await getCollegeGames();
}

export async function getNflFootballGames() {
  return await getNflGames();
}
