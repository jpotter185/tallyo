// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Game = {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  stadiumName: string;
  location: string;
  date: string;
  homeScore: string;
  awayScore: string;
  period: string;
  shortPeriod: string;
  channel: string;
  espnLink: string;
  lastPlay: string;
  currentDownAndDistance: string;
  possessionTeamId: string;
  homeTimeouts: number;
  awayTimeouts: number;
  winner?: string;
  headline?: string;
  odds?: string;
  gameStatus: string;
};
