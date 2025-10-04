"use client";
import { useEffect, useState } from "react";
import { getGames } from "./api/api";
import GameCard from "../components/GameCard";
import Header from "../components/Header";
export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  useEffect(() => {
    const fetch = async () => {
      const fetchedGames = await getGames();
      setGames(fetchedGames);
    };
    fetch();
  }, []);

  return (
    <div className="pl-3">
      <Header />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
