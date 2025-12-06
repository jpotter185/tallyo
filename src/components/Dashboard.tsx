import { fetcher } from "@/lib/api/fetcher";
import { useState } from "react";
import useSWR from "swr";
import GameCard from "./GameCard/GameCard";
import { fetchGameStats } from "@/lib/api/games";
import { ChevronDown } from "lucide-react";

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
          <button
            className="flex w-full items-center justify-between p-2 text-2xl font-bold mb-4"
            onClick={() => setIsCfbOpen(!isCfbOpen)}
          >
            <span>Live CFB Games</span>
            <ChevronDown
              textAnchor="end"
              className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                isCfbOpen ? "rotate-180" : ""
              }`}
            ></ChevronDown>
          </button>
          {isCfbOpen && (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-2">
              {cfbGames.map((game) => {
                return (
                  <GameCard
                    key={game.id}
                    game={game}
                    isOpen={!!openGames[game.id]}
                    toggleOpenGame={() => toggleGame(game.id)}
                    getStatsForGame={fetchGameStats}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
      {nflGames.length > 0 && (
        <div>
          <button
            className="flex w-full items-center justify-between p-2 text-2xl font-bold mb-4"
            onClick={() => setIsNflOpen(!isNflOpen)}
          >
            <span>Live NFL Games</span>
            <ChevronDown
              textAnchor="end"
              className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                isNflOpen ? "rotate-180" : ""
              }`}
            ></ChevronDown>
          </button>
          {isNflOpen && (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-2">
              {nflGames.map((game) => {
                return (
                  <GameCard
                    key={game.id}
                    game={game}
                    isOpen={!!openGames[game.id]}
                    toggleOpenGame={() => toggleGame(game.id)}
                    getStatsForGame={fetchGameStats}
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
