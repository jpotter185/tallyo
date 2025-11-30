"use client";

interface GameProps {
  game: Game;
  getStatsForGame: (
    league: "nfl" | "cfb",
    gameId: string
  ) => Promise<{ stats: Map<string, Stat>; scoringPlays: ScoringPlay[] }>;
  isOpen: boolean;
  toggleOpenGame: () => void;
}

import FullsizeGameCard from "./FullSizeGameCard";
import CompactGameCard from "./CompactGameCard";
import { useState } from "react";
import { useGameStats } from "../hooks/useGameStats";
const GameCard: React.FC<GameProps> = ({
  game,
  isOpen,
  toggleOpenGame,
}) => {
  const [openStatsForGame, setOpenStatsForGame] = useState<{
    [id: string]: boolean;
  }>({});
  const [openScoringPlaysForGame, setOpenScoringPlaysForGame] = useState<{
    [id: string]: boolean;
  }>({});

  const toggleOpenScoringPlays = (id: string) => {
    setOpenScoringPlaysForGame((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleOpenStatsForGame = (id: string) => {
    setOpenStatsForGame((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const { data } = useGameStats(game.league, game.id, isOpen);
  return (
    <div
      className={`border border-gray-300 dark:border-gray-500 p-5 rounded-lg shadow-lg bg-neutral-300 dark:bg-neutral-500 transition-transform duration-300 ${
        isOpen ? "p-2" : "p-1 scale-[0.99]"
      } cursor-pointer`}
      onClick={toggleOpenGame}
    >
      {isOpen ? (
        <FullsizeGameCard
          game={game}
          stats={data?.stats}
          scoringPlays={data?.scoringPlays}
          openScoringPlaysForGame={() => toggleOpenScoringPlays(game.id)}
          isScoringPlaysOpen={!!openScoringPlaysForGame[game.id]}
          openStatsForGame={() => toggleOpenStatsForGame(game.id)}
          isStatsOpen={!!openStatsForGame[game.id]}
        />
      ) : (
        <CompactGameCard game={game} />
      )}
    </div>
  );
};

export default GameCard;
