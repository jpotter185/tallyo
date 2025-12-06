import useSWR from "swr";
import { fetchGameStats } from "@/lib/api/games";

export function useGameStats(
  league: "nfl" | "cfb",
  gameId: string,
  isOpen: boolean,
) {
  return useSWR(
    isOpen ? ["gameStats", league, gameId] : null,
    () => fetchGameStats(league, gameId),
    { refreshInterval: 10000 },
  );
}
