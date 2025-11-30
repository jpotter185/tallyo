import { fetcher } from "@/lib/api/fetcher";
import { useState } from "react";
import useSWR from "swr";
import GameCard from "./GameCard/GameCard";
import { fetchGameStats } from "@/lib/api/games";

const Dashboard: React.FC = () => {
  const [openGames, setOpenGames] = useState<Record<string, boolean>>({});

  const toggleGame = (id: string) => {
    setOpenGames((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const { data: cfbData } = useSWR(`/api/games?league=cfb`, fetcher, {
    refreshInterval: 10000,
  });
  const cfbGames: Game[] = cfbData?.games ?? [];

  const { data: nflData } = useSWR(`/api/games?league=nfl`, fetcher, {
    refreshInterval: 10000,
  });
  const nflGames = nflData?.games ?? [];

  const topGames = [
    ...(cfbGames?.slice(0, 3) ?? []),
    ...(nflGames?.slice(0, 3) ?? []),
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Top Games</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-2">
        {topGames.map((game) => {
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
    </div>
  );
};

export default Dashboard;
