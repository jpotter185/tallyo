import { isHomeTeamLeftAligned } from "./leagues/leagueConfig";

type GameSide = {
  team: Team;
  score: string;
  record: string;
  timeouts: number;
  statSide: "homeStats" | "awayStats";
};

export function getGameSides(game: Game): { left: GameSide; right: GameSide } {
  const homeOnLeft = isHomeTeamLeftAligned(game.league);

  if (homeOnLeft) {
    return {
      left: {
        team: game.homeTeam,
        score: game.homeScore,
        record: game.homeRecordAtTimeOfGame,
        timeouts: game.homeTimeouts,
        statSide: "homeStats",
      },
      right: {
        team: game.awayTeam,
        score: game.awayScore,
        record: game.awayRecordAtTimeOfGame,
        timeouts: game.awayTimeouts,
        statSide: "awayStats",
      },
    };
  }

  return {
    left: {
      team: game.awayTeam,
      score: game.awayScore,
      record: game.awayRecordAtTimeOfGame,
      timeouts: game.awayTimeouts,
      statSide: "awayStats",
    },
    right: {
      team: game.homeTeam,
      score: game.homeScore,
      record: game.homeRecordAtTimeOfGame,
      timeouts: game.homeTimeouts,
      statSide: "homeStats",
    },
  };
}
