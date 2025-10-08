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
          <p className="px-3">
            {week !== "" ? "Week " + week : "Current Week"}
          </p>
          <select
            id="numberSelect"
            value={week ?? ""}
            onChange={(e) => setWeek(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select a week --</option>
            {Array.from({ length: numberOfWeeks }, (_, i) => i + 1).map(
              (num) => (
                <option key={num} value={num}>
                  Week {num}
                </option>
              )
            )}
          </select>
          <div className="p-2 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default League;
