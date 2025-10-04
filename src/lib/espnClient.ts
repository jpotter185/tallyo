const NFL_CURRENT_WEEK_ENDPOINT =
  "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";

export async function getCurrentWeekGames(): Promise<Game[]> {
  const response = await fetch(NFL_CURRENT_WEEK_ENDPOINT);
  const data = await response.json();
  const events = data.events;
  let games: Game[] = [];
  if (events && events.length > 0) {
    for (const event of events) {
      for (const competition of event.competitions) {
        const homeTeam = competition.competitors.find(
          (c: { homeAway: string }) => c.homeAway === "home"
        )!;
        const awayTeam = competition.competitors.find(
          (c: { homeAway: string }) => c.homeAway === "away"
        )!;
        let game: Game = {
          homeTeam: homeTeam.team.displayName,
          awayTeam: awayTeam.team.displayName,
          id: competition.id,
          date: competition.date,
          location: competition.venue.fullName,
          homeScore: homeTeam.score,
          awayScore: awayTeam.score,
        };
        games.push(game);
      }
    }
  }
  return games;
}
