import GameStatusEnums from "@/types/GameStatusEnums";

export const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  timeZoneName: "short",
});

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

export const defaultCfbGroupId = "-1";

export async function getGamesFromJson(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  league: "nfl" | "cfb"
): Promise<Game[]> {
  const games: Game[] = [];
  const events = data.events;
  if (events && events.length > 0) {
    for (const event of events) {
      for (const competition of event.competitions) {
        const stats: Stat[] = getStatLeadersForGame(competition.leaders);
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

        const currentDownAndDistance = competition.situation?.downDistanceText;
        const homeTimeouts = competition.situation?.homeTimeouts;
        const awayTimeouts = competition.situation?.awayTimeouts;
        const date = dateFormatter.format(new Date(competition.startDate));

        const gameOdds = await getOdds(competition.id, league);

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
          headline: headline,
          odds: gameOdds,
          homeTimeouts: homeTimeouts,
          awayTimeouts: awayTimeouts,
          stats: stats,
        };
        games.push(game);
      }
    }
  }
  return sortGames(games);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getStatLeadersForGame(leaders: any) {
  const stats: Stat[] = [];
  for (const leader of leaders) {
    const stat: Stat = {
      name: leader.name,
      displayName: leader.displayName,
      shortDisplayName: leader.shortDisplayName,
      abbreviation: leader.abbreviation,
      value: leader.value,
      displayValue: leader.leaders[0].displayValue,
      playerName: leader.leaders[0].athlete.fullName,
      playerShortName: leader.leaders[0].athlete.shortName,
      teamId: leader.leaders[0].team.id,
    };
    stats.push(stat);
  }
  return stats;
}

type GameStatus =
  | "STATUS_IN_PROGRESS"
  | "STATUS_HALFTIME"
  | "STATUS_SCHEDULED"
  | "STATUS_FINAL";

function sortGames(games: Game[]) {
  games.sort((gameA: Game, gameB: Game) => {
    const gameAStatus = GameStatusEnums[gameA.gameStatus as GameStatus];
    const gameBStatus = GameStatusEnums[gameB.gameStatus as GameStatus];

    if (gameAStatus === gameBStatus) {
      return (
        new Date(gameA.isoDate).getTime() - new Date(gameB.isoDate).getTime()
      );
    } else {
      return gameAStatus - gameBStatus;
    }
  });
  return games;
}

async function getOdds(eventId: string, league: "nfl" | "cfb") {
  const ODDS_API_ENDPOINT = `https://sports.core.api.espn.com/v2/sports/football/leagues/${
    league === "nfl" ? "nfl" : "college-football"
  }/events/${eventId}/competitions/${eventId}/odds/58`;
  try {
    const response = await fetch(ODDS_API_ENDPOINT);
    const data = await response?.json();
    return data?.details;
  } catch (error) {
    console.error(error);
    return undefined;
  }
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getNflStandingsFromJson(json: any) {
  const conferenceGroups = json.content.standings.groups;
  const standings: Standings[] = [];
  for (const conferenceGroup of conferenceGroups) {
    const conferenceGroupName = conferenceGroup.name;
    let conferenceTeams: Team[] = [];
    for (const divisionGroup of conferenceGroup.groups) {
      const divisionGroupName = divisionGroup.name;
      const standingEntries = divisionGroup.standings.entries;
      for (const standingEntry of standingEntries) {
        const teamInfo = standingEntry.team;
        const teamStats = standingEntry.stats;
        let team: Team = {
          id: teamInfo.id,
          name: teamInfo.displayName,
          abbreviation: teamInfo.abbreviation,
          logo: teamInfo.logos[0].href,
          location: teamInfo.location,
          seed: teamInfo.seed,
          division: divisionGroupName,
        };
        team = populateTeamStats(team, teamStats);
        conferenceTeams.push(team);
      }
    }
    try {
      const sortedConferenceTeams = [...conferenceTeams].sort(
        (teamA, teamB) => {
          const teamAIntSeed = parseInt(teamA.seed || "100");
          const teamBIntSeed = parseInt(teamB.seed || "100");
          return teamAIntSeed - teamBIntSeed;
        }
      );
      conferenceTeams = sortedConferenceTeams;
    } catch (error) {
      console.error("error when sorting teams by seed ", error);
    }
    const conferenceStandings: Standings = {
      teams: conferenceTeams,
      groupName: conferenceGroupName,
    };
    standings.push(conferenceStandings);
  }
  return standings;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function populateTeamStats(team: Team, stats: any) {
  for (const stat of stats) {
    team[stat.type] = stat.displayValue;
  }
  if (team.wins && team.losses && team.ties) {
    team.record = `${team.wins}-${team.losses}-${team.ties}`;
  }
  return team;
}
