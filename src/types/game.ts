// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Game = {
  id: string;
  league: "nfl" | "cfb" | "nhl";
  homeTeam: Team;
  awayTeam: Team;
  stadiumName: string;
  location: string;
  isoDate: string;
  date: string;
  homeScore: string;
  awayScore: string;
  period: string;
  shortPeriod: string;
  channel: string;
  espnLink: string;
  lastPlay: string;
  currentDownAndDistance: string;
  down: string;
  ballLocation: string;
  possessionTeamId: string;
  homeTimeouts: number;
  awayTimeouts: number;
  winner?: string;
  headline?: string;
  gameOdd?: Odds;
  gameStatus: string;
  stats: TeamStats;
  homeWinPercentage?: string;
  awayWinPercentage?: string;
  final?: boolean;
  homeRecordAtTimeOfGame: string;
  awayRecordAtTimeOfGame: string;
};

type TeamStats = {
  homeStats: Record<string,string>;
  awayStats: Record<string,string>;
};

