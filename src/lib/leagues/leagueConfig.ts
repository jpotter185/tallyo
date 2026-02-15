import {
  footballStatsToDisplay,
  hockeyStatsToDisplay,
} from "@/lib/espn/enums/statDisplayMaps";

export const LEAGUE_IDS = ["nfl", "cfb", "nhl"] as const;

export type LeagueId = (typeof LEAGUE_IDS)[number];
export type LeagueContextMode = "season" | "date";

interface LeagueConfig {
  label: string;
  path: `/${string}`;
  supportsStandings: boolean;
  showInHeader: boolean;
  showInDashboard: boolean;
  contextMode: LeagueContextMode;
  contextEndpoint: string;
  seasonTypes: Map<string, string>;
  numberOfWeeks: Map<string, number>;
  yearOptions: string[];
  statsToDisplay: Map<string, string>;
}

const yearOptions = [
  "2026",
  "2025",
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "2017",
  "2016",
  "2015",
];

export const LEAGUE_CONFIG: Record<LeagueId, LeagueConfig> = {
  nfl: {
    label: "NFL",
    path: "/nfl",
    supportsStandings: true,
    showInHeader: true,
    showInDashboard: true,
    contextMode: "season",
    contextEndpoint: "/api/v1/games/context?league={league}",
    seasonTypes: new Map<string, string>([
      ["1", "Preseason"],
      ["2", "Regular Season"],
      ["3", "Postseason"],
    ]),
    numberOfWeeks: new Map<string, number>([
      ["1", 4],
      ["2", 18],
      ["3", 5],
    ]),
    yearOptions,
    statsToDisplay: footballStatsToDisplay,
  },
  cfb: {
    label: "CFB",
    path: "/cfb",
    supportsStandings: true,
    showInHeader: true,
    showInDashboard: true,
    contextMode: "season",
    contextEndpoint: "/api/v1/games/context?league={league}",
    seasonTypes: new Map<string, string>([
      ["2", "Regular Season"],
      ["3", "Postseason"],
    ]),
    numberOfWeeks: new Map<string, number>([
      ["2", 15],
      ["3", 1],
    ]),
    yearOptions,
    statsToDisplay: footballStatsToDisplay,
  },
  nhl: {
    label: "NHL",
    path: "/nhl",
    supportsStandings: false,
    showInHeader: true,
    showInDashboard: true,
    contextMode: "date",
    contextEndpoint: "/api/v1/games/nhl-dates",
    seasonTypes: new Map<string, string>(),
    numberOfWeeks: new Map<string, number>(),
    yearOptions: [],
    statsToDisplay: hockeyStatsToDisplay,
  },
};

export function parseLeagueId(value?: string | null): LeagueId | null {
  const normalized = value?.toLowerCase();
  if (!normalized) {
    return null;
  }
  return LEAGUE_IDS.includes(normalized as LeagueId)
    ? (normalized as LeagueId)
    : null;
}

export function isLeagueId(value?: string | null): value is LeagueId {
  return parseLeagueId(value) !== null;
}

export const HEADER_LEAGUE_LINKS = LEAGUE_IDS.filter(
  (id) => LEAGUE_CONFIG[id].showInHeader,
).map((id) => ({
  label: LEAGUE_CONFIG[id].label,
  href: LEAGUE_CONFIG[id].path,
}));
