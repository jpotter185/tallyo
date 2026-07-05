import { useState } from "react";
import Image from "next/image";
import { HeaderConstants } from "../types/StandingsConstants";
import { StandingsGroup, StandingsTeam } from "@/types/api-contract";
import CollapsableSection from "./CollapsableSection";

interface StandingsProps {
  standings: StandingsGroup[];
  isLoading: boolean;
  league: string;
}

type SortDirection = "asc" | "desc";

type StandingsColumn = {
  id: string;
  header: { long: string; short: string };
  render: (team: StandingsTeam) => React.ReactNode;
  sticky: boolean;
  sortValue?: (team: StandingsTeam) => string | number;
};

type StandingsRow = {
  team: StandingsTeam;
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
  buildSections: (standing: StandingsGroup) => StandingsSection[];
};

// ESPN stat keys vary by league/endpoint; return the first non-empty value.
const stat = (team: StandingsTeam, ...keys: string[]): string | undefined => {
  for (const key of keys) {
    const value = team.stats?.[key];
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }
  return undefined;
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

const getPointsPerGame = (
  points: string | undefined,
  gamesPlayed: string | undefined,
): number | null => {
  const pointsValue = parseSortableNumber(points);
  const gamesPlayedValue = parseSortableNumber(gamesPlayed);
  if (!Number.isFinite(pointsValue) || !Number.isFinite(gamesPlayedValue)) {
    return null;
  }
  if (gamesPlayedValue <= 0) {
    return null;
  }
  return pointsValue / gamesPlayedValue;
};

const getPointsValue = (team: StandingsTeam): number => {
  const parsed = Number(stat(team, "points"));
  return Number.isFinite(parsed) ? parsed : -1;
};

const getPlayoffSeedValue = (team: StandingsTeam): number => {
  const parsed = Number(stat(team, "playoffseed") || team.seed);
  return Number.isFinite(parsed) ? parsed : 999;
};

const TEAM_COLUMN: StandingsColumn = {
  id: "team",
  header: HeaderConstants.TeamName,
  render: (team) => (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-1">
      <Image src={team.logo} alt="" width={24} height={24} />
      {team.abbreviation}
    </div>
  ),
  sticky: true,
  sortValue: (team) => team.abbreviation || team.name || "",
};

const RANK_COLUMN: StandingsColumn = {
  id: "rank",
  header: HeaderConstants.Rank,
  render: (team) => team.seed || stat(team, "playoffseed") || "-",
  sticky: false,
  sortValue: (team) =>
    parseSortableNumber(team.seed || stat(team, "playoffseed")),
};

const NHL_COLUMNS: StandingsColumn[] = [
  {
    id: "points",
    header: { long: "Points", short: "PTS" },
    render: (t) => stat(t, "points") ?? "-",
    sticky: false,
    sortValue: (t) => parseSortableNumber(stat(t, "points")),
  },
  {
    id: "gp",
    header: { long: "Games Played", short: "GP" },
    render: (t) => stat(t, "gamesplayed") ?? "-",
    sticky: false,
    sortValue: (t) => parseSortableNumber(stat(t, "gamesplayed")),
  },
  {
    id: "ppg",
    header: { long: "Points Per Game", short: "PPG" },
    render: (t) => {
      const ppg = getPointsPerGame(stat(t, "points"), stat(t, "gamesplayed"));
      return ppg === null ? "-" : ppg.toFixed(2);
    },
    sticky: false,
    sortValue: (t) =>
      getPointsPerGame(stat(t, "points"), stat(t, "gamesplayed")) ??
      Number.NEGATIVE_INFINITY,
  },
  {
    id: "gf",
    header: { long: "Goals For", short: "GF" },
    render: (t) => stat(t, "pointsfor") ?? "-",
    sticky: false,
    sortValue: (t) => parseSortableNumber(stat(t, "pointsfor")),
  },
  {
    id: "ga",
    header: { long: "Goals Against", short: "GA" },
    render: (t) => stat(t, "pointsagainst") ?? "-",
    sticky: false,
    sortValue: (t) => parseSortableNumber(stat(t, "pointsagainst")),
  },
  {
    id: "record",
    header: HeaderConstants.OverallRecord,
    render: (t) => stat(t, "total") || t.record || "-",
    sticky: false,
  },
  {
    id: "diff",
    header: HeaderConstants.Differential,
    render: (t) => stat(t, "pointdifferential", "pointsdiff") || "-",
    sticky: false,
    sortValue: (t) =>
      parseSortableNumber(stat(t, "pointdifferential", "pointsdiff")),
  },
  {
    id: "streak",
    header: { long: "Streak", short: "STRK" },
    render: (t) => stat(t, "streak") ?? "-",
    sticky: false,
  },
  {
    id: "last10",
    header: { long: "Last 10", short: "L10" },
    render: (t) => stat(t, "lasttengames")?.replace(/,\s*0 PTS$/, "") ?? "-",
    sticky: false,
  },
];

const BASE_COLUMNS: StandingsColumn[] = [
  {
    id: "record",
    header: HeaderConstants.OverallRecord,
    render: (t) => t.record || stat(t, "total"),
    sticky: false,
  },
  {
    id: "vsconf",
    header: HeaderConstants.ConferenceRecord,
    render: (t) => stat(t, "vsconf"),
    sticky: false,
  },
  {
    id: "pf",
    header: HeaderConstants.PointsFor,
    render: (t) => stat(t, "pointsfor"),
    sticky: false,
    sortValue: (t) => parseSortableNumber(stat(t, "pointsfor")),
  },
  {
    id: "pa",
    header: HeaderConstants.PointsAgainst,
    render: (t) => stat(t, "pointsagainst"),
    sticky: false,
    sortValue: (t) => parseSortableNumber(stat(t, "pointsagainst")),
  },
  {
    id: "diff",
    header: HeaderConstants.Differential,
    render: (t) => t.differential,
    sticky: false,
    sortValue: (t) => parseSortableNumber(t.differential),
  },
];

const NFL_EXTRA_COLUMNS: StandingsColumn[] = [
  {
    id: "wp",
    header: HeaderConstants.WinPercentage,
    render: (t) => stat(t, "winpercent"),
    sticky: false,
    sortValue: (t) => parseSortableNumber(stat(t, "winpercent")),
  },
  {
    id: "vsdiv",
    header: HeaderConstants.DivisionRecord,
    render: (t) => stat(t, "vsdiv"),
    sticky: false,
  },
];

const MLS_COLUMNS: StandingsColumn[] = [
  {
    id: "points",
    header: { long: "Points", short: "PTS" },
    render: (t) => stat(t, "points", "pts") ?? "-",
    sticky: false,
    sortValue: (t) => parseSortableNumber(stat(t, "points", "pts")),
  },
  {
    id: "gp",
    header: { long: "Games Played", short: "GP" },
    render: (t) => stat(t, "gamesplayed", "gamesPlayed") ?? "-",
    sticky: false,
    sortValue: (t) =>
      parseSortableNumber(stat(t, "gamesplayed", "gamesPlayed")),
  },
  {
    id: "ppg",
    header: { long: "Points Per Game", short: "PPG" },
    render: (t) => {
      const ppg = getPointsPerGame(
        stat(t, "points", "pts"),
        stat(t, "gamesplayed", "gamesPlayed"),
      );
      return ppg === null ? "-" : ppg.toFixed(2);
    },
    sticky: false,
    sortValue: (t) =>
      getPointsPerGame(
        stat(t, "points", "pts"),
        stat(t, "gamesplayed", "gamesPlayed"),
      ) ?? Number.NEGATIVE_INFINITY,
  },
  {
    id: "record",
    header: HeaderConstants.OverallRecord,
    render: (t) => t.record || stat(t, "total") || "-",
    sticky: false,
  },
  {
    id: "gf",
    header: { long: "Goals For", short: "GF" },
    render: (t) => stat(t, "goalsfor", "goalsFor", "pointsfor") ?? "-",
    sticky: false,
    sortValue: (t) =>
      parseSortableNumber(stat(t, "goalsfor", "goalsFor", "pointsfor")),
  },
  {
    id: "ga",
    header: { long: "Goals Against", short: "GA" },
    render: (t) =>
      stat(t, "goalsagainst", "goalsAgainst", "pointsagainst") ?? "-",
    sticky: false,
    sortValue: (t) =>
      parseSortableNumber(
        stat(t, "goalsagainst", "goalsAgainst", "pointsagainst"),
      ),
  },
  {
    id: "diff",
    header: HeaderConstants.Differential,
    render: (t) =>
      t.differential || stat(t, "pointdifferential", "pointsdiff") || "-",
    sticky: false,
    sortValue: (t) =>
      parseSortableNumber(
        t.differential || stat(t, "pointdifferential", "pointsdiff"),
      ),
  },
];

// Classic tournament group table: P W D L GF GA GD Pts.
const WORLD_CUP_COLUMNS: StandingsColumn[] = [
  {
    id: "gp",
    header: { long: "Played", short: "GP" },
    render: (t) => stat(t, "gamesplayed") ?? "-",
    sticky: false,
    sortValue: (t) => parseSortableNumber(stat(t, "gamesplayed")),
  },
  {
    id: "wins",
    header: { long: "Wins", short: "W" },
    render: (t) => stat(t, "wins") ?? "-",
    sticky: false,
    sortValue: (t) => parseSortableNumber(stat(t, "wins")),
  },
  {
    id: "draws",
    header: { long: "Draws", short: "D" },
    render: (t) => stat(t, "ties") ?? "-",
    sticky: false,
    sortValue: (t) => parseSortableNumber(stat(t, "ties")),
  },
  {
    id: "losses",
    header: { long: "Losses", short: "L" },
    render: (t) => stat(t, "losses") ?? "-",
    sticky: false,
    sortValue: (t) => parseSortableNumber(stat(t, "losses")),
  },
  {
    id: "gf",
    header: { long: "Goals For", short: "GF" },
    render: (t) => stat(t, "pointsfor") ?? "-",
    sticky: false,
    sortValue: (t) => parseSortableNumber(stat(t, "pointsfor")),
  },
  {
    id: "ga",
    header: { long: "Goals Against", short: "GA" },
    render: (t) => stat(t, "pointsagainst") ?? "-",
    sticky: false,
    sortValue: (t) => parseSortableNumber(stat(t, "pointsagainst")),
  },
  {
    id: "gd",
    header: { long: "Goal Difference", short: "GD" },
    render: (t) => stat(t, "pointdifferential") ?? "-",
    sticky: false,
    sortValue: (t) => parseSortableNumber(stat(t, "pointdifferential")),
  },
  {
    id: "points",
    header: { long: "Points", short: "PTS" },
    render: (t) => stat(t, "points") ?? "-",
    sticky: false,
    sortValue: (t) => parseSortableNumber(stat(t, "points")),
  },
];

const buildFlatSections = (standing: StandingsGroup): StandingsSection[] => [
  {
    key: `${standing.groupName}-all`,
    rows: standing.teams.map((team) => ({ team })),
  },
];

const buildNhlSections = (standing: StandingsGroup): StandingsSection[] => {
  const groups = new Map<string, StandingsTeam[]>();
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

  if (league === "WC") {
    return {
      title: "World Cup Standings",
      columns: [TEAM_COLUMN, ...WORLD_CUP_COLUMNS],
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
