// AUTO-GENERATED FILE. DO NOT EDIT.
// Generated from OpenAPI schema. Run `npm run gen:api-types`.

export interface components {
  schemas: {
        "ApiError": {
          "code": string;
          "message": string;
          "details"?: string;
          "path"?: string;
          "timestamp"?: string;
        };
        "TeamKey": {
          "teamId": number;
          "league": string;
        };
        "Team": {
          "teamKey": components["schemas"]["TeamKey"];
          "id": string;
          "name": string;
          "abbreviation": string;
          "logo": string;
          "primaryColor"?: string;
          "alternateColor"?: string;
          "location": string;
          "record"?: string;
          "score"?: string;
        };
        "TeamStats": {
          "homeStats"?: { [key: string]: string };
          "awayStats"?: { [key: string]: string };
        };
        "GameOdd": {
          "spreadText"?: string;
        };
        "Game": {
          "id": string;
          "league": "nfl" | "cfb" | "nhl" | "mls";
          "homeTeam": components["schemas"]["Team"];
          "awayTeam": components["schemas"]["Team"];
          "stadiumName"?: string;
          "location"?: string;
          "isoDate": string;
          "date": string;
          "homeScore"?: string;
          "awayScore"?: string;
          "period"?: string;
          "shortPeriod"?: string;
          "channel"?: string;
          "espnLink"?: string;
          "lastPlay"?: string;
          "currentDownAndDistance"?: string;
          "down"?: string;
          "ballLocation"?: string;
          "possessionTeamId"?: string;
          "homeTimeouts"?: number;
          "awayTimeouts"?: number;
          "winner"?: string;
          "headline"?: string;
          "gameOdd"?: components["schemas"]["GameOdd"];
          "gameStatus"?: string;
          "stats"?: components["schemas"]["TeamStats"];
          "homeWinPercentage"?: string;
          "awayWinPercentage"?: string;
          "finalGame"?: boolean;
          "final"?: boolean;
          "homeRecordAtTimeOfGame"?: string;
          "awayRecordAtTimeOfGame"?: string;
        };
        "CurrentContext": {
          "year": number;
          "seasonType": number;
          "date": string;
          "week": number;
        };
        "LeagueMetadata": {
          "id": string;
          "label": string;
          "path": string;
          "supportsStandings": boolean;
          "contextMode": "season" | "date";
          "supportsYearFilter": boolean;
          "supportsWeekFilter": boolean;
          "statsProfile": "football" | "hockey" | "soccer";
          "teamOrder": "away-left" | "home-left";
          "supportsOdds": boolean;
          "supportsLiveDetails": boolean;
          "showInHeader": boolean;
          "showInDashboard": boolean;
        };
        "GamesPage": {
          "content": (components["schemas"]["Game"])[];
          "page": number;
          "size": number;
          "totalElements": number;
          "totalPages": number;
          "first": boolean;
          "last": boolean;
        };
  };
}
