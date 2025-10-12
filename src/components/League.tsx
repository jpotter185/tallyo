"use client";
import GameCard from "./GameCard";
import Selector from "./Selector";
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
  scoreboardGroups: string[];
  currentScoreboardGroup: string;
  setCurrentScoreboardGroup: Dispatch<SetStateAction<string>>;
  displayMap?: Map<string, string>;
  openGames: Record<string, boolean>;
  toggleOpenGame: (id: string) => void;
}

const League: React.FC<LeagueProps> = ({
  leagueName,
  games,
  isOpen,
  setIsOpen,
  week,
  setWeek,
  numberOfWeeks,
  scoreboardGroups,
  currentScoreboardGroup,
  setCurrentScoreboardGroup,
  displayMap,
  openGames,
  toggleOpenGame,
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
            {leagueName === "CFB" && (
              <Selector
                currentValue={currentScoreboardGroup}
                data={scoreboardGroups}
                setCurrentValue={setCurrentScoreboardGroup}
                displayMap={displayMap}
              ></Selector>
            )}
            <Selector
              currentValue={week}
              data={Array.from({ length: numberOfWeeks }, (_, i) =>
                String(i + 1)
              )}
              setCurrentValue={setWeek}
              displayString="Week"
            ></Selector>
            <div className="py-2 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {games.map((game) => {
                return (
                  <GameCard
                    key={game.id}
                    game={game}
                    isOpen={!!openGames[game.id]}
                    toggleOpenGame={() => toggleOpenGame(game.id)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default League;
