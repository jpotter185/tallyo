import GameCard from "./GameCard";
import { Dispatch, SetStateAction } from "react";
import { ChevronDown } from "lucide-react";

interface LeagueProps {
  games: Game[];
  leagueName: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const League: React.FC<LeagueProps> = ({
  leagueName,
  games,
  isOpen,
  setIsOpen,
}) => {
  return (
    <div>
      <button
        className="flex w-full items-center justify-between p-2 text-2xl font-bold mb-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{leagueName} Games</span>
        <ChevronDown
          textAnchor="end"
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        ></ChevronDown>
      </button>

      {isOpen && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
};

export default League;
