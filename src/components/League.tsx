"use client";
import GameCard from "./GameCard/GameCard";
import Selector from "./Selector";
import { Dispatch, SetStateAction } from "react";
import CollapsableSection from "./CollapsableSection";

interface LeagueProps {
  games: Game[];
  leagueName: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  week: string;
  numberOfWeeks: Map<string, number>;
  setWeek: Dispatch<SetStateAction<string>>;
  openGames: Record<string, boolean>;
  toggleOpenGame: (id: string) => void;
  isLoading: boolean;
  seasonType: string;
  setSeasonType: Dispatch<SetStateAction<string>>;
  year: string;
  setYear: Dispatch<SetStateAction<string>>;
  seasonTypes: Map<string, string>;
  customSelectorValue?: string;
  customSelectorMap?: Map<string, string>;
  setCustomSelectorValue?: Dispatch<SetStateAction<string>>;
  showYearSelector?: boolean;
  yearOptions?: string[];
  statsToDisplay: Map<string, string>;
}

const League: React.FC<LeagueProps> = ({
  leagueName,
  games,
  isOpen,
  setIsOpen,
  week,
  setWeek,
  numberOfWeeks,
  openGames,
  toggleOpenGame,
  isLoading,
  seasonType,
  setSeasonType,
  year,
  setYear,
  seasonTypes,
  customSelectorValue,
  customSelectorMap,
  setCustomSelectorValue,
  showYearSelector = true,
  yearOptions = [],
  statsToDisplay,
}) => {
  return (
    <div>
      <CollapsableSection
        title={`${leagueName} Games`}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div>
          <div className="px-3">
            {customSelectorMap != undefined &&
              customSelectorMap.size > 0 &&
              customSelectorValue != undefined &&
              setCustomSelectorValue != undefined && (
                <Selector
                  currentValue={
                    [...customSelectorMap.entries()].find(
                      ([, iso]) => iso === customSelectorValue,
                    )?.[0] || ""
                  }
                  data={Array.from(customSelectorMap.keys())}
                  setCurrentValue={(prettyDate) =>
                    setCustomSelectorValue(
                      customSelectorMap.get(prettyDate) || "",
                    )
                  }
                />
              )}
            {showYearSelector && yearOptions.length > 0 && (
              <Selector
                currentValue={year}
                data={yearOptions}
                setCurrentValue={(value: string) => setYear(value)}
              ></Selector>
            )}
            {seasonTypes.size > 0 && (
              <Selector
                currentValue={seasonType}
                data={Array.from(seasonTypes.keys())}
                setCurrentValue={(value: string) => setSeasonType(value)}
                displayMap={seasonTypes}
              ></Selector>
            )}

            {numberOfWeeks &&
              numberOfWeeks.size > 0 &&
              numberOfWeeks.get(seasonType) !== undefined && (
                <Selector
                  currentValue={week}
                  data={Array.from(
                    { length: numberOfWeeks.get(seasonType) || 18 },
                    (_, i) => String(i + 1),
                  )}
                  setCurrentValue={setWeek}
                  displayString="Week"
                ></Selector>
              )}

            {isLoading && (
              <div className="text-sm text-gray-600 dark:text-gray-300 py-1">
                Updating games...
              </div>
            )}
            {games && games.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-2">
                {games.map((game) => {
                  return (
                    <GameCard
                      key={game.id}
                      game={game}
                      isOpen={!!openGames[game.id]}
                      toggleOpenGame={() => toggleOpenGame(game.id)}
                      statsToDisplay={statsToDisplay}
                    />
                  );
                })}
              </div>
            ) : isLoading ? null : (
              <div>No games match filter</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default League;
