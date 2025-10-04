"use client";
import { useEffect, useState } from "react";
import { getCollegeFootballGames, getNflFootballGames } from "./api/api";
import GameCard from "../components/GameCard";
import Header from "../components/Header";
import LeagueHeader from "@/components/League";
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
  }, []);

  return (
    <div className="pl-3">
      <Header />
      <League leagueName="CFB" games={cfbGames} />
      <League leagueName="NFL" games={nflGames} />
    </div>
  );
}
