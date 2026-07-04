import { Game, Team } from "@/types/api-contract";
import { isHomeTeamLeftAligned } from "./leagues/leagueConfig";

export type GameSide = {
  team: Team;
  score?: string;
  record?: string;
  timeouts?: number;
  statSide: "homeStats" | "awayStats";
};

export function getGameSides(game: Game): { left: GameSide; right: GameSide } {
  const homeSide: GameSide = {
    team: game.homeTeam,
    score: game.homeScore,
    record: game.homeRecordAtTimeOfGame,
    timeouts: game.homeTimeouts,
    statSide: "homeStats",
  };
  const awaySide: GameSide = {
    team: game.awayTeam,
    score: game.awayScore,
    record: game.awayRecordAtTimeOfGame,
    timeouts: game.awayTimeouts,
    statSide: "awayStats",
  };

  return isHomeTeamLeftAligned(game.league)
    ? { left: homeSide, right: awaySide }
    : { left: awaySide, right: homeSide };
}
