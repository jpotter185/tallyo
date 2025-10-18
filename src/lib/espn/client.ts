const ENDPOINTS = {
  nfl: "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",
  cfb: "https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard",
  nflstandings: "https://cdn.espn.com/core/nfl/standings?xhr=1",
  cfbstandings: "https://cdn.espn.com/core/college-football/standings?xhr=1",
  nflstats: "https://cdn.espn.com/core/nfl/game?xhr=1&gameId=",
  cfbstats: "https://cdn.espn.com/core/college-football/game?xhr=1&gameId=",
};

export async function fetchEspnGameData(
  sport: "nfl" | "cfb",
  week?: string,
  scoreboardGroupId?: string
) {
  const url = new URL(ENDPOINTS[sport]);
  if (week) url.searchParams.set("week", week);
  if (scoreboardGroupId && scoreboardGroupId !== "-1")
    url.searchParams.set("groups", String(scoreboardGroupId));

  try {
    const response = await fetch(url.toString(), { cache: "no-store" });
    return await response.json();
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function getStatsForGame(
  league: "nfl" | "cfb",
  gameId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  if (gameId) {
    const response = await fetch(ENDPOINTS[`${league}stats`] + gameId);
    const responseJson = await response.json();
    const leaders = responseJson.gamepackageJSON.leaders;
    const scoringPlays = responseJson.gamepackageJSON.scoringPlays;
    return { leaders, scoringPlays };
  } else {
    return { leaders: [], scoringPlays: [] };
  }
}

export async function fetchStandings(sport: "nfl" | "cfb") {
  try {
    const response = await fetch(ENDPOINTS[`${sport}standings`]);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}
