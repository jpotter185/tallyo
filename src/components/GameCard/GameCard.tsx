"use client";

interface GameProps {
  game: Game;
  isOpen: boolean;
  toggleOpenGame: () => void;
}

import FullsizeGameCard from "./FullSizeGameCard";
import CompactGameCard from "./CompactGameCard";
const GameCard: React.FC<GameProps> = ({ game, isOpen, toggleOpenGame }) => {
  return (
    <div
      className={`border border-gray-300 dark:border-gray-500 p-5 rounded-lg shadow-lg bg-neutral-300 dark:bg-neutral-500 transition-transform duration-300 ${
        isOpen ? "p-2" : "p-1 scale-[0.99]"
      } cursor-pointer`}
      onClick={toggleOpenGame}
    >
      {isOpen ? (
        <FullsizeGameCard game={game} />
      ) : (
        <CompactGameCard game={game} />
      )}
    </div>
  );
};

export default GameCard;
