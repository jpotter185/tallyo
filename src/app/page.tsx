"use client";
import { useEffect, useState } from "react";
import { getCollegeFootballGames, getNflFootballGames } from "./api/api";
import GameCard from "../components/GameCard";
import Header from "../components/Header";
import LeagueHeader from "@/components/LeagueHeader";
export default function Home() {
  const [nflGames, setNflGames] = useState<Game[]>([]);
  const [cfbGames, setCfbGames] = useState<Game[]>([]);
  useEffect(() => {
    const fetch = async () => {
      const fetchedCfbGames = await getCollegeFootballGames();
      setCfbGames(fetchedCfbGames);
      const fetchedNflGames = await getNflFootballGames();
      setNflGames(fetchedNflGames);
    };
    fetch();
  }, []);

  return (
    <div className="pl-3">
      <Header />
      <LeagueHeader leagueName="NFL"/>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {nflGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
      <LeagueHeader leagueName="CFB"/>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cfbGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
