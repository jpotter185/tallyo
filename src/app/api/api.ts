import { getCurrentWeekGames } from "@/lib/espnClient";

export async function getGames() {
  return await getCurrentWeekGames();
}
