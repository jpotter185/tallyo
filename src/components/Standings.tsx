import { useState } from "react";
import { HeaderConstants } from "../types/StandingsConstants";
import Image from "next/image";
import CollapsableSection from "./CollapsableSection";

interface StandingsProps {
  standings: Standings[];
  isLoading: boolean;
  league: string;
}

type SortDirection = "asc" | "desc";

type StandingsColumn = {
  id: string;
  header: { long: string; short: string };
  render: (team: Team) => React.ReactNode;
  sticky: boolean;
  sortValue?: (team: Team) => string | number;
};

type StandingsRow = {
  team: Team;
  tag?: string;
  isEmphasized?: boolean;
};

type StandingsSection = {
  key: string;
  title?: string;
  rows: StandingsRow[];
};

type StandingsProfile = {
  title: string;
  columns: StandingsColumn[];
  sortScope: "global" | "section";
  buildSections: (standing: Standings) => StandingsSection[];
};

const parseSortableNumber = (value: string | number | undefined): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : Number.NEGATIVE_INFINITY;
  }
  if (!value) {
    return Number.NEGATIVE_INFINITY;
  }
  const cleaned = value.replace(/[^0-9.+-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : Number.NEGATIVE_INFINITY;
};

const getPointsPerGame = (team: Team): number | null => {
  const points = parseSortableNumber(team.points);
  const gamesPlayed = parseSortableNumber(team.gamesplayed);
  if (!Number.isFinite(points) || !Number.isFinite(gamesPlayed)) {
    return null;
  }
  if (gamesPlayed <= 0) {
    return null;
  }
  return points / gamesPlayed;
};

const getFirstDefined = (
  team: Team,
  keys: string[],
): string | number | undefined => {
  for (const key of keys) {
    const value = team[key];
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }
  return undefined;
};

const getPointsValue = (team: Team): number => {
  const parsed = Number(team.points);
  return Number.isFinite(parsed) ? parsed : -1;
};

const getPlayoffSeedValue = (team: Team): number => {
  const parsed = Number(team.playoffseed || team.seed);
  return Number.isFinite(parsed) ? parsed : 999;
};

const TEAM_COLUMN: StandingsColumn = {
  id: "team",
  header: HeaderConstants.TeamName,
  render: (team: Team) => (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-1">
      <Image src={team.logo} alt="" width={24} height={24} />
      {team.ranking ? team.ranking + team.abbreviation : team.abbreviation}
    </div>
  ),
  sticky: true,
  sortValue: (team: Team) => team.abbreviation || team.name || "",
};

const RANK_COLUMN: StandingsColumn = {
  id: "rank",
  header: HeaderConstants.Rank,
  render: (team: Team) => team.seed || team.playoffseed || "-",
  sticky: false,
  sortValue: (team: Team) => parseSortableNumber(team.seed || team.playoffseed),
};

const NHL_COLUMNS: StandingsColumn[] = [
  {
    id: "points",
    header: { long: "Points", short: "PTS" },
    render: (t: Team) => t.points ?? "-",
    sticky: false,
    sortValue: (t: Team) => parseSortableNumber(t.points),
  },
  {
    id: "gp",
    header: { long: "Games Played", short: "GP" },
    render: (t: Team) => t.gamesplayed ?? "-",
    sticky: false,
    sortValue: (t: Team) => parseSortableNumber(t.gamesplayed),
  },
  {
    id: "ppg",
    header: { long: "Points Per Game", short: "PPG" },
    render: (t: Team) => {
      const ppg = getPointsPerGame(t);
      return ppg === null ? "-" : ppg.toFixed(2);
    },
    sticky: false,
    sortValue: (t: Team) => getPointsPerGame(t) ?? Number.NEGATIVE_INFINITY,
  },
  {
    id: "gf",
    header: { long: "Goals For", short: "GF" },
    render: (t: Team) => t.pointsfor ?? "-",
    sticky: false,
    sortValue: (t: Team) => parseSortableNumber(t.pointsfor),
  },
  {
    id: "ga",
    header: { long: "Goals Against", short: "GA" },
    render: (t: Team) => t.pointsagainst ?? "-",
    sticky: false,
    sortValue: (t: Team) => parseSortableNumber(t.pointsagainst),
  },
  {
    id: "record",
    header: HeaderConstants.OverallRecord,
    render: (t: Team) => t.total || t.record || "-",
    sticky: false,
  },
  {
    id: "diff",
    header: HeaderConstants.Differential,
    render: (t: Team) => t.pointdifferential || t.pointsdiff || "-",
    sticky: false,
    sortValue: (t: Team) =>
      parseSortableNumber(t.pointdifferential || t.pointsdiff),
  },
  {
    id: "streak",
    header: { long: "Streak", short: "STRK" },
    render: (t: Team) => t.streak ?? "-",
    sticky: false,
  },
  {
    id: "last10",
    header: { long: "Last 10", short: "L10" },
    render: (t: Team) => t.lasttengames?.replace(/,\s*0 PTS$/, "") ?? "-",
    sticky: false,
  },
];

const BASE_COLUMNS: StandingsColumn[] = [
  {
    id: "record",
    header: HeaderConstants.OverallRecord,
    render: (t: Team) => t.record || t.total,
    sticky: false,
  },
  {
    id: "vsconf",
    header: HeaderConstants.ConferenceRecord,
    render: (t: Team) => t.vsconf,
    sticky: false,
  },
  {
    id: "pf",
    header: HeaderConstants.PointsFor,
    render: (t: Team) => t.pointsfor,
    sticky: false,
    sortValue: (t: Team) => parseSortableNumber(t.pointsfor),
  },
  {
    id: "pa",
    header: HeaderConstants.PointsAgainst,
    render: (t: Team) => t.pointsagainst,
    sticky: false,
    sortValue: (t: Team) => parseSortableNumber(t.pointsagainst),
  },
  {
    id: "diff",
    header: HeaderConstants.Differential,
    render: (t: Team) => t.differential,
    sticky: false,
    sortValue: (t: Team) => parseSortableNumber(t.differential),
  },
];

const NFL_EXTRA_COLUMNS: StandingsColumn[] = [
  {
    id: "wp",
    header: HeaderConstants.WinPercentage,
    render: (t: Team) => t.winpercent,
    sticky: false,
    sortValue: (t: Team) => parseSortableNumber(t.winpercent),
  },
  {
    id: "vsdiv",
    header: HeaderConstants.DivisionRecord,
    render: (t: Team) => t.vsdiv,
    sticky: false,
  },
];

const MLS_COLUMNS: StandingsColumn[] = [
  {
    id: "points",
    header: { long: "Points", short: "PTS" },
    render: (t: Team) => getFirstDefined(t, ["points", "pts"]) ?? "-",
    sticky: false,
    sortValue: (t: Team) =>
      parseSortableNumber(
        getFirstDefined(t, ["points", "pts"]) as string | number | undefined,
      ),
  },
  {
    id: "gp",
    header: { long: "Games Played", short: "GP" },
    render: (t: Team) =>
      getFirstDefined(t, ["gamesplayed", "gamesPlayed"]) ?? "-",
    sticky: false,
    sortValue: (t: Team) =>
      parseSortableNumber(
        getFirstDefined(t, ["gamesplayed", "gamesPlayed"]) as
          | string
          | number
          | undefined,
      ),
  },
  {
    id: "ppg",
    header: { long: "Points Per Game", short: "PPG" },
    render: (t: Team) => {
      const points = parseSortableNumber(
        getFirstDefined(t, ["points", "pts"]) as string | number | undefined,
      );
      const gamesPlayed = parseSortableNumber(
        getFirstDefined(t, ["gamesplayed", "gamesPlayed"]) as
          | string
          | number
          | undefined,
      );
      if (
        !Number.isFinite(points) ||
        !Number.isFinite(gamesPlayed) ||
        gamesPlayed <= 0
      ) {
        return "-";
      }
      return (points / gamesPlayed).toFixed(2);
    },
    sticky: false,
    sortValue: (t: Team) => {
      const points = parseSortableNumber(
        getFirstDefined(t, ["points", "pts"]) as string | number | undefined,
      );
      const gamesPlayed = parseSortableNumber(
        getFirstDefined(t, ["gamesplayed", "gamesPlayed"]) as
          | string
          | number
          | undefined,
      );
      if (
        !Number.isFinite(points) ||
        !Number.isFinite(gamesPlayed) ||
        gamesPlayed <= 0
      ) {
        return Number.NEGATIVE_INFINITY;
      }
      return points / gamesPlayed;
    },
  },
  {
    id: "record",
    header: HeaderConstants.OverallRecord,
    render: (t: Team) => t.record || t.total || "-",
    sticky: false,
  },
  {
    id: "gf",
    header: { long: "Goals For", short: "GF" },
    render: (t: Team) =>
      getFirstDefined(t, ["goalsfor", "goalsFor", "pointsfor"]) ?? "-",
    sticky: false,
    sortValue: (t: Team) =>
      parseSortableNumber(
        getFirstDefined(t, ["goalsfor", "goalsFor", "pointsfor"]) as
          | string
          | number
          | undefined,
      ),
  },
  {
    id: "ga",
    header: { long: "Goals Against", short: "GA" },
    render: (t: Team) =>
      getFirstDefined(t, ["goalsagainst", "goalsAgainst", "pointsagainst"]) ??
      "-",
    sticky: false,
    sortValue: (t: Team) =>
      parseSortableNumber(
        getFirstDefined(t, [
          "goalsagainst",
          "goalsAgainst",
          "pointsagainst",
        ]) as string | number | undefined,
      ),
  },
  {
    id: "diff",
    header: HeaderConstants.Differential,
    render: (t: Team) =>
      getFirstDefined(t, ["differential", "pointdifferential", "pointsdiff"]) ??
      "-",
    sticky: false,
    sortValue: (t: Team) =>
      parseSortableNumber(
        getFirstDefined(t, [
          "differential",
          "pointdifferential",
          "pointsdiff",
        ]) as string | number | undefined,
      ),
  },
];

const buildFlatSections = (standing: Standings): StandingsSection[] => [
  {
    key: `${standing.groupName}-all`,
    rows: standing.teams.map((team) => ({ team })),
  },
];

const buildNhlSections = (standing: Standings): StandingsSection[] => {
  const groups = new Map<string, Team[]>();
  for (const team of standing.teams) {
    const division = team.division || "Other";
    if (!groups.has(division)) {
      groups.set(division, []);
    }
    groups.get(division)?.push(team);
  }

  const divisionEntries = Array.from(groups.entries()).map(
    ([division, teams]) => {
      const sortedTeams = [...teams].sort((a, b) => {
        const pointsDiff = getPointsValue(b) - getPointsValue(a);
        if (pointsDiff !== 0) {
          return pointsDiff;
        }
        return getPlayoffSeedValue(a) - getPlayoffSeedValue(b);
      });
      return { division, teams: sortedTeams };
    },
  );

  const labels = new Map<string, string>();
  for (const division of divisionEntries) {
    division.teams.slice(0, 3).forEach((team, index) => {
      labels.set(team.id, `Div${index + 1}`);
    });
  }

  const wildcardCandidates = divisionEntries
    .flatMap((division) => division.teams.slice(3))
    .sort((a, b) => {
      const pointsDiff = getPointsValue(b) - getPointsValue(a);
      if (pointsDiff !== 0) {
        return pointsDiff;
      }
      return getPlayoffSeedValue(a) - getPlayoffSeedValue(b);
    });
  wildcardCandidates.slice(0, 2).forEach((team, index) => {
    labels.set(team.id, `WC${index + 1}`);
  });

  return divisionEntries.map((division) => ({
    key: `${standing.groupName}-${division.division}`,
    title: division.division,
    rows: division.teams.map((team) => {
      const tag = labels.get(team.id);
      return {
        team,
        tag,
        isEmphasized: !!tag,
      };
    }),
  }));
};

const getProfile = (league: string): StandingsProfile => {
  if (league === "NHL") {
    return {
      title: "NHL Playoff Standings",
      columns: [TEAM_COLUMN, ...NHL_COLUMNS],
      sortScope: "section",
      buildSections: buildNhlSections,
    };
  }

  if (league === "NFL") {
    return {
      title: "NFL Standings",
      columns: [
        RANK_COLUMN,
        TEAM_COLUMN,
        BASE_COLUMNS[0],
        ...NFL_EXTRA_COLUMNS,
        ...BASE_COLUMNS.slice(1),
      ],
      sortScope: "global",
      buildSections: buildFlatSections,
    };
  }

  if (league === "MLS") {
    return {
      title: "MLS Standings",
      columns: [TEAM_COLUMN, ...MLS_COLUMNS],
      sortScope: "global",
      buildSections: buildFlatSections,
    };
  }

  return {
    title: `${league} Standings`,
    columns: [RANK_COLUMN, TEAM_COLUMN, ...BASE_COLUMNS],
    sortScope: "global",
    buildSections: buildFlatSections,
  };
};

const Standings: React.FC<StandingsProps> = ({
  standings,
  isLoading,
  league,
}) => {
  const profile = getProfile(league);
  const [openStandings, setOpenStandings] = useState<{ [id: string]: boolean }>(
    {},
  );
  const [isStandingsOpen, setIsStandingsOpen] = useState<boolean>(false);
  const [sortByScope, setSortByScope] = useState<
    Record<string, { columnId: string; direction: SortDirection }>
  >({});

  const toggleOpenStandings = (id: string) => {
    setOpenStandings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getSortState = (scopeKey: string) => sortByScope[scopeKey] ?? null;

  const toggleSort = (columnId: string, scopeKey: string) => {
    setSortByScope((prev) => {
      const current = prev[scopeKey];
      const next = { ...prev };
      if (!current || current.columnId !== columnId) {
        next[scopeKey] = { columnId, direction: "desc" };
        return next;
      }
      if (current.direction === "desc") {
        next[scopeKey] = { columnId, direction: "asc" };
        return next;
      }
      delete next[scopeKey];
      return next;
    });
  };

  const getSortedRows = (rows: StandingsRow[], scopeKey: string) => {
    const sortState = getSortState(scopeKey);
    if (!sortState) {
      return rows;
    }

    const sortColumn = profile.columns.find(
      (col) => col.id === sortState.columnId,
    );
    if (!sortColumn?.sortValue) {
      return rows;
    }

    const sorted = [...rows].sort((a, b) => {
      const aValue = sortColumn.sortValue!(a.team);
      const bValue = sortColumn.sortValue!(b.team);
      if (typeof aValue === "number" && typeof bValue === "number") {
        return aValue - bValue;
      }
      return String(aValue).localeCompare(String(bValue));
    });

    return sortState.direction === "desc" ? sorted.reverse() : sorted;
  };

  return (
    <div className="divide-x divide-gray-500">
      <CollapsableSection
        title={profile.title}
        isOpen={isStandingsOpen}
        onToggle={() => setIsStandingsOpen(!isStandingsOpen)}
      />
      {isStandingsOpen && isLoading && <div>Loading...</div>}
      {isStandingsOpen &&
        !isLoading &&
        standings.map((standing) => (
          <div key={standing.groupName}>
            <CollapsableSection
              title={standing.groupName}
              isOpen={openStandings[standing.groupName]}
              onToggle={() => toggleOpenStandings(standing.groupName)}
            />

            {openStandings[standing.groupName] && (
              <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                  {profile.buildSections(standing).map((section) => {
                    const scopeKey =
                      profile.sortScope === "global" ? "global" : section.key;
                    const sortState = getSortState(scopeKey);
                    const sortedRows = getSortedRows(section.rows, scopeKey);

                    return (
                      <div key={section.key}>
                        {section.title && (
                          <div className="px-2 py-1 border border-gray-500 font-medium">
                            {section.title}
                          </div>
                        )}
                        <div
                          className="px-1 grid border border-gray-500 divide-x divide-gray-500"
                          style={{
                            gridTemplateColumns: `repeat(${profile.columns.length}, minmax(0, 1fr))`,
                          }}
                        >
                          {profile.columns.map((col) => (
                            <div
                              key={col.id}
                              className={`p-1 ${
                                col.sticky
                                  ? "sticky left-0 z-20 bg-sky-50 dark:bg-neutral-800"
                                  : ""
                              }`}
                            >
                              {col.sortValue ? (
                                <button
                                  type="button"
                                  onClick={() => toggleSort(col.id, scopeKey)}
                                  className="w-full text-left"
                                >
                                  <div className="hidden md:inline">
                                    {col.header.long}
                                    {sortState?.columnId === col.id &&
                                      (sortState.direction === "desc"
                                        ? " ▼"
                                        : " ▲")}
                                  </div>
                                  <div className="inline md:hidden">
                                    {col.header.short}
                                    {sortState?.columnId === col.id &&
                                      (sortState.direction === "desc"
                                        ? " ▼"
                                        : " ▲")}
                                  </div>
                                </button>
                              ) : (
                                <>
                                  <div className="hidden md:inline">
                                    {col.header.long}
                                  </div>
                                  <div className="inline md:hidden">
                                    {col.header.short}
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>

                        {sortedRows.map((row) => (
                          <div
                            className={`px-1 grid border border-gray-500 divide-x divide-gray-500 ${
                              row.isEmphasized ? "font-medium" : ""
                            }`}
                            style={{
                              gridTemplateColumns: `repeat(${profile.columns.length}, minmax(0, 1fr))`,
                            }}
                            key={row.team.id}
                          >
                            {profile.columns.map((col) => (
                              <div
                                key={col.id}
                                className={`p-1 ${
                                  col.sticky
                                    ? "sticky left-0 z-10 bg-sky-50 dark:bg-neutral-800"
                                    : ""
                                }`}
                              >
                                {col.id === "team" && row.tag ? (
                                  <div className="flex items-center gap-2">
                                    <span>{col.render(row.team)}</span>
                                    <span className="text-[10px] leading-4 border border-gray-500 px-1 rounded-sm">
                                      {row.tag}
                                    </span>
                                  </div>
                                ) : (
                                  col.render(row.team)
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default Standings;
