"use client";
import { useEffect, useState } from "react";
import { getCollegeFootballGames, getNflFootballGames } from "./api/api";
import Header from "../components/Header";
import League from "@/components/League";
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
    setInterval(fetch, 30000);
  }, []);

  return (
    <div className="pl-3">
      <Header />
      <League leagueName="CFB" games={cfbGames} />
      <League leagueName="NFL" games={nflGames} />
    </div>
  );
}
