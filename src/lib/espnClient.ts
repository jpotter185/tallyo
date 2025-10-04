const NFL_CURRENT_WEEK_ENDPOINT =
  "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";

export async function getCurrentWeekGames(): Promise<Game[]> {
  const response = await fetch(NFL_CURRENT_WEEK_ENDPOINT);
  const data = await response.json();
  const events = data.events;
  const games: Game[] = [];
  if (events && events.length > 0) {
    for (const event of events) {
      for (const competition of event.competitions) {
        const homeTeam = competition.competitors.find(
          (c: { homeAway: string }) => c.homeAway === "home"
        );
        const awayTeam = competition.competitors.find(
          (c: { homeAway: string }) => c.homeAway === "away"
        );
        const game: Game = {
          homeTeam: homeTeam.team.displayName,
          awayTeam: awayTeam.team.displayName,
          id: competition.id,
          location: competition.venue.fullName,
          homeScore: homeTeam.score === "0" ? " " : homeTeam.score,
          awayScore: awayTeam.score === "0" ? " " : awayTeam.score,
          period: competition.status.type.detail,
          channel: competition.broadcasts[0].names[0],
        };
        console.log(game);
        games.push(game);
      }
    }
  }
  return games;
}
