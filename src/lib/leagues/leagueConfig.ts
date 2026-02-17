import { components } from "@/types/api.generated";
import {
  footballStatsToDisplay,
  hockeyStatsToDisplay,
  soccerStatsToDisplay,
} from "@/lib/espn/enums/statDisplayMaps";

export type LeagueId = string;
export type LeagueContextMode = "season" | "date";
export type LeagueMetadata = components["schemas"]["LeagueMetadata"];

export interface LeagueRuntimeConfig {
  id: LeagueId;
  label: string;
  path: `/${string}`;
  supportsStandings: boolean;
  supportsOdds: boolean;
  supportsLiveDetails: boolean;
  teamOrder: "away-left" | "home-left";
  showInHeader: boolean;
  showInDashboard: boolean;
  contextMode: LeagueContextMode;
  statsProfile?: string;
  seasonTypes: Map<string, string>;
  numberOfWeeks: Map<string, number>;
  yearOptions: string[];
  statsToDisplay: Map<string, string>;
}

const LEAGUE_ID_REGEX = /^[a-z0-9-]+$/;

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

const DEFAULT_LEAGUE_METADATA: LeagueMetadata[] = [
  {
    id: "nfl",
    label: "NFL",
    path: "/nfl",
    supportsStandings: true,
    contextMode: "season",
    supportsYearFilter: true,
    supportsWeekFilter: true,
    statsProfile: "football",
    teamOrder: "away-left",
    supportsOdds: true,
    supportsLiveDetails: true,
    showInHeader: true,
    showInDashboard: true,
  },
  {
    id: "cfb",
    label: "CFB",
    path: "/cfb",
    supportsStandings: true,
    contextMode: "season",
    supportsYearFilter: true,
    supportsWeekFilter: true,
    statsProfile: "football",
    teamOrder: "away-left",
    supportsOdds: true,
    supportsLiveDetails: true,
    showInHeader: true,
    showInDashboard: true,
  },
  {
    id: "nhl",
    label: "NHL",
    path: "/nhl",
    supportsStandings: false,
    contextMode: "date",
    supportsYearFilter: false,
    supportsWeekFilter: false,
    statsProfile: "hockey",
    teamOrder: "away-left",
    supportsOdds: false,
    supportsLiveDetails: false,
    showInHeader: true,
    showInDashboard: true,
  },
  {
    id: "mls",
    label: "MLS",
    path: "/mls",
    supportsStandings: false,
    contextMode: "date",
    supportsYearFilter: false,
    supportsWeekFilter: false,
    statsProfile: "soccer",
    teamOrder: "home-left",
    supportsOdds: false,
    supportsLiveDetails: false,
    showInHeader: true,
    showInDashboard: true,
  },
];

const UI_PRESETS: Record<
  string,
  {
    seasonTypes: Map<string, string>;
    numberOfWeeks: Map<string, number>;
    yearOptions: string[];
  }
> = {
  nfl: {
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
  },
  cfb: {
    seasonTypes: new Map<string, string>([
      ["2", "Regular Season"],
      ["3", "Postseason"],
    ]),
    numberOfWeeks: new Map<string, number>([
      ["2", 15],
      ["3", 1],
    ]),
    yearOptions,
  },
};

const EMPTY_PRESET = {
  seasonTypes: new Map<string, string>(),
  numberOfWeeks: new Map<string, number>(),
  yearOptions: [],
};

function getStatsMapForProfile(profile?: string): Map<string, string> {
  if (profile === "hockey") {
    return hockeyStatsToDisplay;
  }
  if (profile === "soccer") {
    return soccerStatsToDisplay;
  }
  return footballStatsToDisplay;
}

export function getFallbackLeagueMetadata(): LeagueMetadata[] {
  return DEFAULT_LEAGUE_METADATA;
}

export function buildLeagueConfigs(
  metadata?: LeagueMetadata[] | null,
): LeagueRuntimeConfig[] {
  const source =
    metadata && metadata.length > 0 ? metadata : DEFAULT_LEAGUE_METADATA;
  return source.map((league) => {
    const preset = UI_PRESETS[league.id] ?? EMPTY_PRESET;
    return {
      id: league.id,
      label: league.label,
      path: league.path as `/${string}`,
      supportsStandings: league.supportsStandings,
      supportsOdds: league.supportsOdds,
      supportsLiveDetails: league.supportsLiveDetails,
      teamOrder: league.teamOrder,
      showInHeader: league.showInHeader,
      showInDashboard: league.showInDashboard,
      contextMode: league.contextMode as LeagueContextMode,
      statsProfile: league.statsProfile,
      seasonTypes: preset.seasonTypes,
      numberOfWeeks: preset.numberOfWeeks,
      yearOptions: preset.yearOptions,
      statsToDisplay: getStatsMapForProfile(league.statsProfile),
    };
  });
}

export function getLeagueConfigById(
  leagueId: string,
  metadata?: LeagueMetadata[] | null,
): LeagueRuntimeConfig | null {
  return (
    buildLeagueConfigs(metadata).find((league) => league.id === leagueId) ??
    null
  );
}

export function parseLeagueId(value?: string | null): LeagueId | null {
  const normalized = value?.toLowerCase().trim();
  if (!normalized || !LEAGUE_ID_REGEX.test(normalized)) {
    return null;
  }
  return normalized;
}

export function isHomeTeamLeftAligned(leagueId: string): boolean {
  const league = getLeagueConfigById(leagueId);
  return league?.teamOrder === "home-left";
}

export function supportsOddsForLeague(leagueId: string): boolean {
  const league = getLeagueConfigById(leagueId);
  return !!league?.supportsOdds;
}

export function supportsLiveDetailsForLeague(leagueId: string): boolean {
  const league = getLeagueConfigById(leagueId);
  return !!league?.supportsLiveDetails;
}
