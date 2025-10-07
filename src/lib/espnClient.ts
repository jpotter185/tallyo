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

        const winner = competition.competitors.find(
          (c: { winner: boolean }) => c.winner === true
        );

        const homeTeamObject: Team = buildTeam(homeTeam);
        const awayTeamObject: Team = buildTeam(awayTeam);

        const gameStatus = competition.status.type.name;
        const homeTeamScore = determineScore(homeTeam.score, gameStatus);
        const awayTeamScore = determineScore(awayTeam.score, gameStatus);
        const posessionTeamId = competition.situation?.possession;
        const gameLocation = buildGameLocationString(competition.venue.address);

        const currentDownAndDistance = competition.situation?.downDistanceText;
        const game: Game = {
          id: competition.id,
          homeTeam: homeTeamObject,
          awayTeam: awayTeamObject,
          stadiumName: competition.venue.fullName,
          location: gameLocation,
          homeScore: homeTeamScore,
          awayScore: awayTeamScore,
          period: competition.status.type.detail,
          channel: competition.broadcasts[0].names[0],
          espnLink: event.links[0].href,
          lastPlay: competition?.situation?.lastPlay?.text,
          possessionTeamId: posessionTeamId ? posessionTeamId : undefined,
          currentDownAndDistance: currentDownAndDistance,
          winner: winner ? winner.id : undefined,
        };
        console.log(game);
        games.push(game);
      }
    }
  }
  return games;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildGameLocationString(address: any): string {
  const competitionCity = address.city;
  const competitionState = address.state;
  const competitionCountry = address.country;

  return `${competitionCity ? competitionCity + "," : ""} ${
    competitionState ? competitionState + "," : ""
  } ${competitionCountry ? competitionCountry : ""}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildTeam(teamJson: any): Team {
  const teamRank =
    teamJson?.curatedRank?.current === 99 || !teamJson?.curatedRank?.current
      ? ""
      : "#" + teamJson?.curatedRank?.current + " ";

  const teamName = teamDisplayName(teamRank, teamJson);
  const teamRecord = getTeamRecord(teamJson.records);

  const teamObject: Team = {
    id: teamJson.id,
    name: teamName,
    logo: teamJson.team.logo,
    primaryColor: teamJson.team.color,
    alternateColor: teamJson.team.alternateColor,
    location: teamJson.team.location,
    record: teamRecord,
  };

  return teamObject;
}

function determineScore(score: string, gameStatus: string) {
  if (gameStatus === "STATUS_SCHEDULED") {
    return "";
  } else {
    return score;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function teamDisplayName(teamRank: string, team: any): string {
  return teamRank + team.team.displayName;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getTeamRecord(records: any[]): string {
  const record = records.find((r) => r.name === "overall");
  return record?.summary ? record.summary : "0-0";
}
