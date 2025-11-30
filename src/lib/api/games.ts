export async function fetchGameStats(league: "nfl" | "cfb", gameId: string) {
  try {
    // Call your backend route
    const res = await fetch(`/api/stats?league=${league}&gameId=${gameId}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch stats: ${res.statusText}`);
    }

    // The backend returns:
    // { stats: [ [playerId, statObj], ... ], scoringPlays: [...] }
    const { stats, scoringPlays } = await res.json();

    // Convert stats array back into a Map
    const statMap = new Map<string, Stat>(stats as [string, Stat][]);

    return { stats: statMap, scoringPlays };
  } catch (error) {
    console.error("Error fetching game stats:", error);
    // Return empty/default values so frontend doesn't crash
    return { stats: new Map<string, Stat>(), scoringPlays: [] };
  }
}
