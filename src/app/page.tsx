"use client";
import { useEffect, useState } from "react";
import { getCollegeFootballGames, getNflFootballGames } from "./api/api";
import Header from "../components/Header";
import League from "@/components/League";

export default function Home() {
  const [nflGames, setNflGames] = useState<Game[]>([]);
  const [cfbGames, setCfbGames] = useState<Game[]>([]);
  const [isCfbOpen, setIsCfbOpen] = useState<boolean>(false);
  const [isNflOpen, setIsNflOpen] = useState<boolean>(false);

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
    <div className="p-2 bg-sky-50 dark:bg-neutral-800">
      <Header />
      <League
        leagueName="CFB"
        games={cfbGames}
        isOpen={isCfbOpen}
        setIsOpen={setIsCfbOpen}
      />
      <League
        leagueName="NFL"
        games={nflGames}
        isOpen={isNflOpen}
        setIsOpen={setIsNflOpen}
      />
    </div>
  );
}
