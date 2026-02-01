import { fetcher } from "@/lib/api/fetcher";
import { useState } from "react";
import useSWR from "swr";
import GameCard from "./GameCard/GameCard";
import CollapsableSection from "./CollapsableSection";
import {
  footballStatsToDisplay,
  hockeyStatsToDisplay,
} from "@/lib/espn/enums/statDisplayMaps";

const Dashboard: React.FC = () => {
  const [isCfbOpen, setIsCfbOpen] = useState(false);
  const [isNflOpen, setIsNflOpen] = useState(false);
  const [isNhlOpen, setIsNhlOpen] = useState(false);
  const [openGames, setOpenGames] = useState<Record<string, boolean>>({});

  const toggleGame = (id: string) => {
    setOpenGames((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const { data: nhlData, isLoading: isNhlLoading } = useSWR(
    `/api/games/current?league=nhl`,
    fetcher,
    {
      refreshInterval: 10000,
    },
  );
  let nhlGames: Game[] = [];
  if (nhlData) {
    nhlGames =
      nhlData
        .filter(
          (game: Game) =>
            !game.winner && !(game.gameStatus === "STATUS_SCHEDULED"),
        )
        .sort((a: Game, b: Game) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }) ?? [];
  }

  const { data: cfbData, isLoading: isCfbLoading } = useSWR(
    `/api/games/current?league=cfb`,
    fetcher,
    {
      refreshInterval: 10000,
    },
  );
  let cfbGames: Game[] = [];
  if (cfbData) {
    cfbGames =
      cfbData
        .filter(
          (game: Game) =>
            !game.winner && !(game.gameStatus === "STATUS_SCHEDULED"),
        )
        .sort((a: Game, b: Game) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }) ?? [];
  }

  const { data: nflData, isLoading: isNflLoading } = useSWR(
    `/api/games/current?league=nfl`,
    fetcher,
    {
      refreshInterval: 10000,
    },
  );
  let nflGames: Game[] = [];
  if (nflData) {
    nflGames =
      nflData
        .filter(
          (game: Game) =>
            !game.winner && !(game.gameStatus === "STATUS_SCHEDULED"),
        )
        .sort((a: Game, b: Game) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }) ?? [];
  }

  return (
    <div className="p-4">
      {isCfbLoading ? <div>Loading CFB games...</div> : <></>}
      {isNflLoading ? <div>Loading NFL games...</div> : <></>}
      {isNhlLoading ? <div>Loading NHL games...</div> : <></>}
      {!isCfbLoading &&
      !isNflLoading &&
      nhlGames.length <= 0 &&
      cfbGames.length <= 0 &&
      nflGames.length <= 0 ? (
        <div>No live games right now...</div>
      ) : (
        <></>
      )}
      {cfbGames.length > 0 && (
        <div>
          <CollapsableSection
            title={"Live CFB Games"}
            isOpen={isCfbOpen}
            onToggle={() => setIsCfbOpen(!isCfbOpen)}
          />
          {isCfbOpen && (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-2">
              {cfbGames.map((game) => {
                return (
                  <GameCard
                    key={game.id}
                    game={game}
                    isOpen={!!openGames[game.id]}
                    toggleOpenGame={() => toggleGame(game.id)}
                    statsToDisplay={footballStatsToDisplay}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
      {nflGames.length > 0 && (
        <div>
          <CollapsableSection
            title={"Live NFL Games"}
            isOpen={isNflOpen}
            onToggle={() => setIsNflOpen(!isNflOpen)}
          />
          {isNflOpen && (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-2">
              {nflGames.map((game) => {
                return (
                  <GameCard
                    key={game.id}
                    game={game}
                    isOpen={!!openGames[game.id]}
                    toggleOpenGame={() => toggleGame(game.id)}
                    statsToDisplay={footballStatsToDisplay}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
      {nhlGames.length > 0 && (
        <div>
          <CollapsableSection
            title={"Live NHL Games"}
            isOpen={isNhlOpen}
            onToggle={() => setIsNhlOpen(!isNhlOpen)}
          />
          {isNhlOpen && (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-2">
              {nhlGames.map((game) => {
                return (
                  <GameCard
                    key={game.id}
                    game={game}
                    isOpen={!!openGames[game.id]}
                    toggleOpenGame={() => toggleGame(game.id)}
                    statsToDisplay={hockeyStatsToDisplay}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
