"use client";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import League from "@/components/League";
import { getCfbGames, getNflGames } from "@/lib/espnClient";

export default function Home() {
  const [nflGames, setNflGames] = useState<Game[]>([]);
  const [cfbGames, setCfbGames] = useState<Game[]>([]);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isCfbOpen, setIsCfbOpen] = useState<boolean>(false);
  const [isNflOpen, setIsNflOpen] = useState<boolean>(false);
  const [nflWeek, setNflWeek] = useState<string>("");
  const [cfbWeek, setCfbWeek] = useState<string>("");

  useEffect(() => {
    const fetch = async () => {
      const fetchedNflGames = await getNflGames(nflWeek);
      const now = new Date().toISOString();
      console.log(
        `${now} Got ${fetchedNflGames.games.length} NFL game(s) for week ${fetchedNflGames.dataWeek}`
      );
      setNflGames(fetchedNflGames.games);
      setNflWeek(fetchedNflGames.dataWeek);
    };
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, [nflWeek, isNflOpen]);

  useEffect(() => {
    const fetch = async () => {
      const fetchedCfbGames = await getCfbGames(cfbWeek);
      const now = new Date().toISOString();
      console.log(
        `${now} Got ${fetchedCfbGames.games.length} NFL game(s) for week ${fetchedCfbGames.dataWeek}`
      );
      setCfbGames(fetchedCfbGames.games);
      setCfbWeek(fetchedCfbGames.dataWeek);
    };
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, [cfbWeek, isCfbOpen]);

  return (
    <div className="bg-sky-50 dark:bg-neutral-800 border border-gray-500 dark:divide-neutral-800 divide-y divide-gray-500 dark:divide-neutral-800">
      <Header />
      <League
        leagueName="CFB"
        games={cfbGames}
        isOpen={isCfbOpen}
        setIsOpen={setIsCfbOpen}
        week={cfbWeek}
        setWeek={setCfbWeek}
        numberOfWeeks={16}
      />
      <League
        leagueName="NFL"
        games={nflGames}
        isOpen={isNflOpen}
        setIsOpen={setIsNflOpen}
        week={nflWeek}
        setWeek={setNflWeek}
        numberOfWeeks={18}
      />
      <Footer isOpen={isContactOpen} setIsOpen={setIsContactOpen} />
    </div>
  );
}
