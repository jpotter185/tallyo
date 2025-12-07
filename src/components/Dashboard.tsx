import { fetcher } from "@/lib/api/fetcher";
import { useState } from "react";
import useSWR from "swr";
import GameCard from "./GameCard/GameCard";
import CollapsableSection from "./CollapsableSection";

const Dashboard: React.FC = () => {
  const [isCfbOpen, setIsCfbOpen] = useState(false);
  const [isNflOpen, setIsNflOpen] = useState(false);
  const [openGames, setOpenGames] = useState<Record<string, boolean>>({});

  const toggleGame = (id: string) => {
    setOpenGames((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const { data: cfbData, isLoading: isCfbLoading } = useSWR(
    `/api/games?league=cfb`,
    fetcher,
    {
      refreshInterval: 10000,
    },
  );
  const cfbGames: Game[] =
    cfbData?.games
      .filter(
        (game: Game) =>
          !game.winner && !(game.gameStatus === "STATUS_SCHEDULED"),
      )
      .sort((a: Game, b: Game) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }) ?? [];

  const { data: nflData, isLoading: isNflLoading } = useSWR(
    `/api/games?league=nfl`,
    fetcher,
    {
      refreshInterval: 10000,
    },
  );
  const nflGames: Game[] =
    nflData?.games
      .filter(
        (game: Game) =>
          !game.winner && !(game.gameStatus === "STATUS_SCHEDULED"),
      )
      .sort((a: Game, b: Game) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }) ?? [];

  return (
    <div className="p-4">
      {isCfbLoading ? <div>Loading CFB games...</div> : <></>}
      {isNflLoading ? <div>Loading NFL games...</div> : <></>}
      {!isCfbLoading &&
      !isNflLoading &&
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
