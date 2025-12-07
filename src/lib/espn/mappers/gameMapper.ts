import { dateFormatter } from "../enums/dateFormatter";

export default async function getGamesFromJson(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  league: "nfl" | "cfb",
): Promise<Game[]> {
  const games: Game[] = [];
  const events = data.events;
  if (events && events.length > 0) {
    for (const event of events) {
      for (const competition of event.competitions) {
        const homeTeam = competition.competitors.find(
          (c: { homeAway: string }) => c.homeAway === "home",
        );

        const awayTeam = competition.competitors.find(
          (c: { homeAway: string }) => c.homeAway === "away",
        );

        const winner = competition.competitors.find(
          (c: { winner: boolean }) => c.winner === true,
        );

        const homeTeamObject: Team = buildTeam(homeTeam);
        const awayTeamObject: Team = buildTeam(awayTeam);

        const gameStatus = competition?.status?.type?.name;
        const homeTeamScore = determineScore(homeTeam?.score, gameStatus);
        const awayTeamScore = determineScore(awayTeam?.score, gameStatus);
        const posessionTeamId = competition.situation?.possession;
        const gameLocation = buildGameLocationString(
          competition?.venue?.address,
        );
        const channel = competition.broadcast;

        const headline =
          competition.notes && competition.notes.length > 0
            ? competition.notes[0].headline
            : "";

        const currentDownAndDistance = competition.situation?.downDistanceText;
        const homeTimeouts = competition.situation?.homeTimeouts;
        const awayTimeouts = competition.situation?.awayTimeouts;
        const date = dateFormatter.format(new Date(competition.startDate));

        const homeWinPercentage =
          competition.situation?.lastPlay?.probability?.homeWinPercentage;
        const awayWinPercentage =
          competition.situation?.lastPlay?.probability?.awayWinPercentage;

        const game: Game = {
          id: competition.id,
          league: league,
          homeTeam: homeTeamObject,
          awayTeam: awayTeamObject,
          stadiumName: competition?.venue?.fullName,
          location: gameLocation,
          homeScore: homeTeamScore,
          awayScore: awayTeamScore,
          date: date,
          isoDate: new Date(competition.startDate).toISOString(),
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
          final: winner ? true : false,
          headline: headline,
          homeTimeouts: homeTimeouts,
          awayTimeouts: awayTimeouts,
          stats: {},
          homeWinPercentage: homeWinPercentage,
          awayWinPercentage: awayWinPercentage,
        };

        games.push(game);
      }
    }
  }
  return games;
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

  const teamName = teamJson?.team?.displayName;
  const teamRecord = getTeamRecord(teamJson.records);

  const abbreviation = teamJson.team.abbreviation;

  const teamObject: Team = {
    id: teamJson.id,
    name: teamName,
    abbreviation: abbreviation,
    logo: teamJson.team.logo,
    primaryColor: teamJson.team.color,
    alternateColor: teamJson.team.alternateColor,
    location: teamJson.team.location,
    record: teamRecord,
    ranking: teamRank,
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
function getTeamRecord(records: any[]): string {
  if (records && records.length > 0) {
    const record = records.find((r) => r.name === "overall");
    return record?.summary ? record.summary : "0-0";
  }
  return "0-0";
}
