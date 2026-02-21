// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function getStandings(standingsJson: any): Standings[] {
  const conferenceGroups = getConferenceGroups(standingsJson);
  if (conferenceGroups.length === 0) {
    return [];
  }
  const standings: Standings[] = [];
  for (const conferenceGroup of conferenceGroups) {
    const parsed = parseConference(conferenceGroup);
    if (parsed.teams.length > 0) {
      standings.push(parsed);
    }
  }
  return standings;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getConferenceGroups(payload: any): any[] {
  const directGroups = payload?.content?.standings?.groups;
  if (Array.isArray(directGroups)) {
    return directGroups;
  }
  const conferenceChildren = payload?.children;
  if (Array.isArray(conferenceChildren)) {
    const conferences = conferenceChildren.filter((group) =>
      hasStandingsGroupShape(group),
    );
    if (conferences.length > 0) {
      return conferences;
    }
  }

  const candidateGroups: unknown[] = [];
  const visited = new Set<object>();

  // ESPN responses vary by endpoint. Walk the payload and keep only groups
  // that actually contain standings entries directly or in nested groups.
  function walk(node: unknown) {
    if (!node || typeof node !== "object" || visited.has(node)) {
      return;
    }
    visited.add(node);

    const collections = [
      (node as { groups?: unknown }).groups,
      (node as { children?: unknown }).children,
      (node as { items?: unknown }).items,
    ];
    for (const collection of collections) {
      if (!Array.isArray(collection)) {
        continue;
      }
      for (const group of collection) {
        if (hasStandingsGroupShape(group)) {
          candidateGroups.push(group);
        }
      }
    }

    for (const value of Object.values(node)) {
      if (value && typeof value === "object") {
        walk(value);
      }
    }
  }

  walk(payload);
  return candidateGroups as unknown[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hasStandingsGroupShape(group: any): boolean {
  if (extractStandingEntries(group).length > 0) {
    return true;
  }
  if (Array.isArray(group?.groups)) {
    return true;
  }
  if (Array.isArray(group?.children)) {
    return true;
  }
  if (Array.isArray(group?.items)) {
    return true;
  }
  return false;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractStandingEntries(group: any): any[] {
  if (Array.isArray(group?.standings?.entries)) {
    return group.standings.entries;
  }
  if (Array.isArray(group?.entries)) {
    return group.entries;
  }
  return [];
}

function collectEntriesFromGroup(
  group: unknown,
  fallbackDivisionName?: string,
): Array<{ entry: unknown; divisionName?: string }> {
  const groupObj = (group ?? {}) as {
    name?: string;
    groups?: unknown;
    children?: unknown;
    items?: unknown;
  };
  const entries = extractStandingEntries(group);
  const divisionName = groupObj.name ?? fallbackDivisionName;
  if (entries.length > 0) {
    return entries.map((entry) => ({ entry, divisionName }));
  }

  const nested = [
    ...(Array.isArray(groupObj.groups) ? groupObj.groups : []),
    ...(Array.isArray(groupObj.children) ? groupObj.children : []),
    ...(Array.isArray(groupObj.items) ? groupObj.items : []),
  ];
  const collected: Array<{ entry: unknown; divisionName?: string }> = [];
  for (const child of nested) {
    collected.push(...collectEntriesFromGroup(child, divisionName));
  }
  return collected;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseConference(conferenceGroup: any) {
  const conferenceGroupName = conferenceGroup?.name ?? "Standings";
  let conferenceTeams: Team[] = [];

  const entries = collectEntriesFromGroup(conferenceGroup);
  for (const entryInfo of entries) {
    const parsedTeam = parseTeam(
      entryInfo.entry,
      conferenceGroupName,
      entryInfo.divisionName,
    );
    if (parsedTeam) {
      conferenceTeams.push(parsedTeam);
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
): Team | null {
  const teamInfo = standingEntry?.team;
  if (!teamInfo) {
    return null;
  }
  const teamStats = Array.isArray(standingEntry?.stats)
    ? standingEntry.stats
    : [];
  const logo =
    teamInfo?.logos?.[0]?.href ??
    "https://a.espncdn.com/i/teamlogos/leagues/500/nhl.png";
  let team: Team = {
    id: String(teamInfo?.id ?? ""),
    name: teamInfo?.displayName ?? teamInfo?.name ?? "Unknown Team",
    abbreviation: teamInfo?.abbreviation ?? "",
    logo,
    location: teamInfo?.location ?? "",
    seed: teamInfo?.seed,
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
