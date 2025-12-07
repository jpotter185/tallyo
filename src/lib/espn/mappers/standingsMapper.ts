// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function getStandings(standingsJson: any): Standings[] {
  const conferenceGroups = standingsJson.content.standings.groups;
  const standings: Standings[] = [];
  for (const conferenceGroup of conferenceGroups) {
    standings.push(parseConference(conferenceGroup));
  }
  return standings;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseConference(conferenceGroup: any) {
  const conferenceGroupName = conferenceGroup.name;
  let conferenceTeams: Team[] = [];
  if (conferenceGroup.groups) {
    for (const divisionGroup of conferenceGroup.groups) {
      const divisionGroupName = divisionGroup.name;
      const standingEntries = divisionGroup.standings.entries;
      for (const standingEntry of standingEntries) {
        conferenceTeams.push(
          parseTeam(standingEntry, conferenceGroupName, divisionGroupName),
        );
      }
    }
  } else {
    const standingEntries = conferenceGroup.standings.entries;
    for (const standingEntry of standingEntries) {
      conferenceTeams.push(
        parseTeam(standingEntry, conferenceGroupName, undefined),
      );
    }
  }

  try {
    const sortedConferenceTeams = [...conferenceTeams].sort((teamA, teamB) => {
      const teamAIntSeed = parseInt(teamA.seed || "100");
      const teamBIntSeed = parseInt(teamB.seed || "100");
      return teamAIntSeed - teamBIntSeed;
    });
    conferenceTeams = sortedConferenceTeams;
  } catch (error) {
    console.error("error when sorting teams by seed ", error);
  }
  const conferenceStandings: Standings = {
    teams: conferenceTeams,
    groupName: conferenceGroupName,
  };
  return conferenceStandings;
}

function parseTeam(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  standingEntry: any,
  conferenceGroupName: string | undefined,
  divisionGroupName: string | undefined,
) {
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
    conference: conferenceGroupName,
  };
  team = populateTeamStats(team, teamStats);
  if (!team.differential) {
    const differential =
      parseInt(team.pointsfor || "0") - parseInt(team.pointsagainst || "0");
    if (differential) {
      team.differential = differential.toString();
    }
  }
  return team;
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
