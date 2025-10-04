const NFL_CURRENT_WEEK_ENDPOINT =
  "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";

const CFB_CURRENT_WEEK_ENDPOINT =
  "https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard";

export async function getCollegeGames(): Promise<Game[]> {
  const cfbResponse = await fetch(CFB_CURRENT_WEEK_ENDPOINT);
  const cfbData = await cfbResponse.json();
  const collegeGames = getGamesFromJson(cfbData);
  return collegeGames;
}

export async function getNflGames() {
  const nflResponse = await fetch(NFL_CURRENT_WEEK_ENDPOINT);
  const nflData = await nflResponse.json();
  const nflGames = getGamesFromJson(nflData);
  return nflGames;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getGamesFromJson(data: { events: any }): Game[] {
  const games: Game[] = [];
  const events = data.events;
  if (events && events.length > 0) {
    for (const event of events) {
      for (const competition of event.competitions) {
        const homeTeam = competition.competitors.find(
          (c: { homeAway: string }) => c.homeAway === "home"
        );
        const awayTeam = competition.competitors.find(
          (c: { homeAway: string }) => c.homeAway === "away"
        );
        const homeTeamRank =
          homeTeam?.curatedRank?.current === 99 ||
            !homeTeam?.curatedRank?.current
            ? ""
            : "#" + homeTeam?.curatedRank?.current + " ";
        const awayTeamRank =
          awayTeam?.curatedRank?.current === 99 ||
            !awayTeam?.curatedRank?.current
            ? ""
            : "#" + awayTeam?.curatedRank?.current + " ";
        const gameStatus = competition.status.type.name;
        const homeTeamScore = determineScore(homeTeam.score, gameStatus);
        const awayTeamScore = determineScore(awayTeam.score, gameStatus);
        const posessionTeamId = competition.situation?.possession;
        const homeTeamDisplayName = teamDisplayName(homeTeamRank, homeTeam, posessionTeamId);
        const awayTeamDisplayName = teamDisplayName(awayTeamRank, awayTeam, posessionTeamId);
        const game: Game = {
          homeTeam: homeTeamDisplayName,
          homeTeamLogo: homeTeam.team.logo,
          awayTeam: awayTeamDisplayName,
          awayTeamLogo: awayTeam.team.logo,
          id: competition.id,
          location: competition.venue.fullName,
          homeScore: homeTeamScore,
          awayScore: awayTeamScore,
          period: competition.status.type.detail,
          channel: competition.broadcasts[0].names[0],
          espnLink: event.links[0].href,
          lastPlay: competition?.situation?.lastPlay?.text,
        };
        console.log(game);
        games.push(game);
      }
    }
  }
  return games;
}

function determineScore(
  score: string,
  gameStatus: string
) {
  if (gameStatus === "STATUS_SCHEDULED") {
    return " ";
  } else {
    return score;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function teamDisplayName(teamRank: string, team: any, posessionTeamId: string) {
  if (team.team.id === posessionTeamId) {
    return "* " + teamRank + team.team.displayName;
  } else {
    return teamRank + team.team.displayName;
  }
}
