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
            <Selector
              currentValue={year}
              data={[
                "2025",
                "2024",
                "2023",
                "2022",
                "2021",
                "2020",
                "2019",
                "2018",
                "2017",
                "2016",
                "2015",
              ]}
              setCurrentValue={(value: string) => setYear(value)}
            ></Selector>
            <Selector
              currentValue={seasonType}
              data={Array.from(seasonTypes.keys())}
              setCurrentValue={(value: string) => setSeasonType(value)}
              displayMap={seasonTypes}
            ></Selector>

            <Selector
              currentValue={week}
              data={Array.from(
                { length: numberOfWeeks.get(seasonType) || 18 },
                (_, i) => String(i + 1),
              )}
              setCurrentValue={setWeek}
              displayString="Week"
            ></Selector>

            {isLoading ? (
              <div>Loading...</div>
            ) : games && games.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-2">
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
            ) : (
              <div>No games match filter</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default League;
