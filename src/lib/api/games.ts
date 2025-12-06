export async function fetchGameStats(league: "nfl" | "cfb", gameId: string) {
  try {
    const res = await fetch(`/api/stats?league=${league}&gameId=${gameId}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch stats: ${res.statusText}`);
    }

    const { stats, scoringPlays } = await res.json();
    const statMap = new Map<string, Stat>(stats as [string, Stat][]);

    return { stats: statMap, scoringPlays };
  } catch (error) {
    console.error("Error fetching game stats:", error);
    return { stats: new Map<string, Stat>(), scoringPlays: [] };
  }
}
