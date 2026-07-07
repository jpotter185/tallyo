// AUTO-GENERATED FILE. DO NOT EDIT.
// Generated from OpenAPI schema. Run `npm run gen:api-types`.

export interface components {
  schemas: {
    ApiError: {
      code: string;
      message: string;
      details?: string;
      path?: string;
      timestamp?: string;
    };
    TeamKey: {
      teamId: number;
      league: string;
    };
    Team: {
      teamKey: components["schemas"]["TeamKey"];
      id: string;
      name: string;
      abbreviation: string;
      logo: string;
      primaryColor?: string;
      alternateColor?: string;
      location: string;
      record?: string;
      score?: string;
      seed?: string;
      ranking?: string;
      wins?: string;
      losses?: string;
      ties?: string;
      conference?: string;
      division?: string;
      homeRecord?: string;
      roadRecord?: string;
      recordVsConference?: string;
      recordVsDivision?: string;
      pointsFor?: string;
      pointsAgainst?: string;
      pointDifferential?: string;
      streak?: string;
      winPercent?: string;
    };
    TeamStats: {
      homeStats?: { [key: string]: string };
      awayStats?: { [key: string]: string };
    };
    GameOdd: {
      spreadText?: string;
    };
    Game: {
      id: string;
      league: "nfl" | "cfb" | "nhl" | "mls" | "world_cup" | "mlb";
      homeTeam: components["schemas"]["Team"];
      awayTeam: components["schemas"]["Team"];
      stadiumName?: string;
      location?: string;
      isoDate: string;
      date: string;
      homeScore?: string;
      awayScore?: string;
      period?: string;
      shortPeriod?: string;
      channel?: string;
      espnLink?: string;
      lastPlay?: string;
      currentDownAndDistance?: string;
      down?: string;
      ballLocation?: string;
      possessionTeamId?: string;
      homeTimeouts?: number;
      awayTimeouts?: number;
      balls?: number;
      strikes?: number;
      outs?: number;
      winner?: string;
      headline?: string;
      gameOdd?: components["schemas"]["GameOdd"];
      gameStatus?: string;
      stats?: components["schemas"]["TeamStats"];
      homeWinPercentage?: string;
      awayWinPercentage?: string;
      finalGame?: boolean;
      final?: boolean;
      homeRecordAtTimeOfGame?: string;
      awayRecordAtTimeOfGame?: string;
    };
    CurrentContext: {
      year: number;
      seasonType: number;
      date: string;
      week: number;
    };
    LeagueMetadata: {
      id: string;
      label: string;
      path: string;
      supportsStandings: boolean;
      contextMode: "season" | "date";
      supportsYearFilter: boolean;
      supportsWeekFilter: boolean;
      statsProfile: "football" | "hockey" | "soccer" | "baseball";
      teamOrder: "away-left" | "home-left";
      supportsOdds: boolean;
      supportsLiveDetails: boolean;
      supportsPlayerStats: boolean;
      showInHeader: boolean;
      showInDashboard: boolean;
    };
    StandingsTeam: {
      id: string;
      name: string;
      abbreviation: string;
      logo: string;
      location: string;
      seed?: string;
      conference?: string;
      division?: string;
      record?: string;
      differential?: string;
      stats: { [key: string]: string };
    };
    StandingsGroup: {
      groupName: string;
      teams: components["schemas"]["StandingsTeam"][];
    };
    StatLeader: {
      name: string;
      displayName?: string;
      value?: number;
      displayValue?: string;
      playerName?: string;
      playerShortName?: string;
      teamId?: number;
    };
    ScoringPlay: {
      id: string;
      teamId?: string;
      teamName?: string;
      displayText?: string;
      homeScore?: number;
      awayScore?: number;
      scoringType?: string;
      period?: number;
      clock?: string;
    };
    PlayerStatLine: {
      playerId: string;
      playerName?: string;
      playerShortName?: string;
      position?: string;
      batOrder?: number;
      starter?: boolean;
      stats: string[];
    };
    PlayerStatGroup: {
      teamId: number;
      category: string;
      labels: string[];
      players: components["schemas"]["PlayerStatLine"][];
    };
    GameDetails: {
      gameId: string;
      leaders: components["schemas"]["StatLeader"][];
      scoringPlays: components["schemas"]["ScoringPlay"][];
      players: components["schemas"]["PlayerStatGroup"][];
    };
    UpdateResponse: {
      gameCount: number;
      durationMs: number;
    };
    GamesPage: {
      content: components["schemas"]["Game"][];
      page: number;
      size: number;
      totalElements: number;
      totalPages: number;
      first: boolean;
      last: boolean;
    };
  };
}
