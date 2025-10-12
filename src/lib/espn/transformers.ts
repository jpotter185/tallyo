export const cfbGroupIdMapping = new Map([
  ["-1", "Top 25"],
  ["80", "FBS"],
  ["8", "SEC"],
  ["5", "Big Ten"],
  ["4", "Big 12"],
  ["1", "ACC"],
  ["15", "MAC"],
  ["151", "American Athletic Conference"],
  ["12", "CUSA"],
  ["18", "FBS Independents"],
  ["17", "Mountain West"],
  ["9", "Pac 12"],
  ["37", "Sun Belt"],
  ["81", "FCS"],
  ["28", "Big Sky"],
  ["48", "CAA"],
  ["32", "FC Independents"],
  ["22", "Ivy"],
  ["24", "MEAC"],
  ["21", "MVFC"],
  ["25", "NEC"],
  ["179", "OVC-Big South"],
  ["27", "Patriot"],
  ["28", "Pioneer"],
  ["29", "Southern"],
  ["30", "Southland"],
  ["31", "SWAC"],
  ["177", "UAC"],
  ["35", "Div II/III"],
]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getGamesFromJson(data: any): Game[] {
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

        const gameStatus = competition?.status?.type?.name;
        const homeTeamScore = determineScore(homeTeam?.score, gameStatus);
        const awayTeamScore = determineScore(awayTeam?.score, gameStatus);
        const posessionTeamId = competition.situation?.possession;
        const gameLocation = buildGameLocationString(
          competition?.venue?.address
        );
        const channel = competition.broadcast;

        const headline =
          competition.notes && competition.notes.length > 0
            ? competition.notes[0].headline
            : "";

        const gameOdds = getOdds(competition);

        const currentDownAndDistance = competition.situation?.downDistanceText;
        const homeTimeouts = competition.situation?.homeTimeouts;
        const awayTimeouts = competition.situation?.awayTimeouts;
        const dateFormatter = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          timeZoneName: "short",
        });
        const date = dateFormatter.format(new Date(competition.startDate));

        const game: Game = {
          id: competition.id,
          homeTeam: homeTeamObject,
          awayTeam: awayTeamObject,
          stadiumName: competition?.venue?.fullName,
          location: gameLocation,
          homeScore: homeTeamScore,
          awayScore: awayTeamScore,
          date: date,
          gameStatus: gameStatus,
          period: competition?.status?.type?.detail,
          shortPeriod: competition?.status?.type?.shortDetail,
          channel: channel,
          espnLink: event.links[0]?.href,
          lastPlay: competition?.situation?.lastPlay?.text,
          possessionTeamId: posessionTeamId ? posessionTeamId : undefined,
          currentDownAndDistance: currentDownAndDistance,
          down: competition.situation?.shortDownDistanceText,
          ballLocation: competition.situation?.possessionText,
          winner: winner ? winner.id : undefined,
          headline: headline,
          odds: gameOdds,
          homeTimeouts: homeTimeouts,
          awayTimeouts: awayTimeouts,
        };
        games.push(game);
      }
    }
  }
  return games;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getOdds(competition: any) {
  if (competition.odds && competition.odds.length > 0) {
    return competition.odds[0].details;
  }
  return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildGameLocationString(address: any): string {
  if (address) {
    const competitionCity = address.city;
    const competitionState = address.state;
    const competitionCountry = address.country;

    return `${competitionCity ? competitionCity + "," : ""} ${
      competitionState ? competitionState + "," : ""
    } ${competitionCountry ? competitionCountry : ""}`;
  }
  return "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildTeam(teamJson: any): Team {
  const teamRank =
    teamJson?.curatedRank?.current === 99 || !teamJson?.curatedRank?.current
      ? ""
      : "#" + teamJson?.curatedRank?.current + " ";

  const teamName = teamDisplayName(teamRank, teamJson);
  const teamRecord = getTeamRecord(teamJson.records);

  const abbreviation = teamRank
    ? teamRank + teamJson.team.abbreviation
    : teamJson.team.abbreviation;

  const teamObject: Team = {
    id: teamJson.id,
    name: teamName,
    abbreviation: abbreviation,
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
  return teamRank + team?.team?.displayName;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getTeamRecord(records: any[]): string {
  if (records && records.length > 0) {
    const record = records.find((r) => r.name === "overall");
    return record?.summary ? record.summary : "0-0";
  }
  return "0-0";
}
