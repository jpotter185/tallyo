import GameCard from "./GameCard";
import { Dispatch, SetStateAction } from "react";
import { ChevronDown } from "lucide-react";

interface LeagueProps {
  games: Game[];
  leagueName: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  week: string;
  numberOfWeeks: number;
  setWeek: Dispatch<SetStateAction<string>>;
}

const League: React.FC<LeagueProps> = ({
  leagueName,
  games,
  isOpen,
  setIsOpen,
  week,
  setWeek,
  numberOfWeeks,
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
        <div>
          <div className="px-3">
            <select
              id="numberSelect"
              value={week ?? ""}
              onChange={(e) => setWeek(e.target.value)}
              className="border border-gray-500 dark:border-neutral-800 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-500"
            >
              <option value="">- Current Week -</option>
              {Array.from({ length: numberOfWeeks }, (_, i) => i + 1).map(
                (num) => (
                  <option key={num} value={num}>
                    Week {num}
                  </option>
                )
              )}
            </select>
            <div className="py-2 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {games.map((game) => {
                return <GameCard key={game.id} game={game} />;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default League;
