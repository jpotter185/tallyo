const ENDPOINTS = {
  nfl: "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",
  cfb: "https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard",
};

export async function fetchEspnData(
  sport: "nfl" | "cfb",
  week?: string,
  scoreboardGroupId?: string
) {
  const url = new URL(ENDPOINTS[sport]);
  if (week) url.searchParams.set("week", week);
  if (scoreboardGroupId && scoreboardGroupId !== "-1")
    url.searchParams.set("groups", String(scoreboardGroupId));

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch ESPN ${sport} data`);
  }

  return await response.json();
}
