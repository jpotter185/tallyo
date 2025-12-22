"use client";
import GameCard from "./GameCard/GameCard";
import Selector from "./Selector";
import { Dispatch, SetStateAction, useState } from "react";
import CollapsableSection from "./CollapsableSection";
import {
  cfbWeeksList,
  cfbWeeksMap,
} from "@/lib/espn/enums/cfbScoreboardGroupIds";

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
  isLoading: boolean;
  seasonType: string;
  setSeasonType: Dispatch<SetStateAction<string>>;
  year: string;
  setYear: Dispatch<SetStateAction<string>>;
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
  isLoading,
  seasonType,
  setSeasonType,
  year,
  setYear,
}) => {
  const [displayWeek, setDisplayWeek] = useState(week);
  const setCfbWeek = (week: string) => {
    setWeek(cfbWeeksMap.get(week) || "");
    setDisplayWeek(week);
  };
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
            {leagueName === "CFB" &&
              displayWeek != "Bowls" &&
              displayWeek != "CFP" && (
                <Selector
                  currentValue={currentScoreboardGroup}
                  data={scoreboardGroups}
                  setCurrentValue={(value: string) =>
                    setCurrentScoreboardGroup(value)
                  }
                  displayMap={displayMap}
                ></Selector>
              )}

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
              data={["1", "2", "3"]}
              setCurrentValue={(value: string) => setSeasonType(value)}
              displayMap={
                new Map<string, string>([
                  ["1", "Preseason"],
                  ["2", "Regular Season"],
                  ["3", "Postseason"],
                ])
              }
            ></Selector>
            {leagueName === "CFB" && (
              <Selector
                currentValue={displayWeek}
                data={cfbWeeksList}
                setCurrentValue={setCfbWeek}
                displayString={undefined}
              ></Selector>
            )}
            {leagueName === "NFL" && (
              <Selector
                currentValue={week}
                data={Array.from({ length: numberOfWeeks }, (_, i) =>
                  String(i + 1),
                )}
                setCurrentValue={setWeek}
                displayString="Week"
              ></Selector>
            )}
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
