"use client";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import League from "@/components/League";
import { getCfbGames, getNflGames } from "@/lib/espnClient";
import { cfbGroupIdMapping } from "@/lib/espn/transformers";

export default function Home() {
  const [nflGames, setNflGames] = useState<Game[]>([]);
  const [cfbGames, setCfbGames] = useState<Game[]>([]);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isCfbOpen, setIsCfbOpen] = useState<boolean>(false);
  const [isNflOpen, setIsNflOpen] = useState<boolean>(false);
  const [nflWeek, setNflWeek] = useState<string>("");
  const [cfbWeek, setCfbWeek] = useState<string>("");
  const [cfbScoreboardGroup, setCfbScoreboardGroup] = useState<string>("-1");
  const [openGames, setOpenGames] = useState<{ [id: string]: boolean }>({});
  const toggleOpenGame = (id: string) => {
    console.log("Toggling");
    setOpenGames((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
      const fetchedCfbGames = await getCfbGames(cfbWeek, cfbScoreboardGroup);
      const now = new Date().toISOString();
      console.log(
        `${now} Got ${fetchedCfbGames.games.length} CFB game(s) for week ${fetchedCfbGames.dataWeek}`
      );
      setCfbGames(fetchedCfbGames.games);
      setCfbWeek(fetchedCfbGames.dataWeek);
      setCfbScoreboardGroup(fetchedCfbGames.scoreboardGroupId);
    };
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, [cfbWeek, isCfbOpen, cfbScoreboardGroup]);

  return (
    <div className="bg-sky-50 dark:bg-neutral-800 border border-gray-500 divide-y divide-x divide-gray-500 dark:divide-gray-500">
      <Header />
      <div>
        <League
          leagueName="CFB"
          games={cfbGames}
          isOpen={isCfbOpen}
          setIsOpen={setIsCfbOpen}
          week={cfbWeek}
          setWeek={setCfbWeek}
          numberOfWeeks={16}
          scoreboardGroups={Array.from(cfbGroupIdMapping.keys())}
          currentScoreboardGroup={cfbScoreboardGroup}
          setCurrentScoreboardGroup={setCfbScoreboardGroup}
          displayMap={cfbGroupIdMapping}
          openGames={openGames}
          toggleOpenGame={toggleOpenGame}
        />
      </div>
      <div>
        <League
          leagueName="NFL"
          games={nflGames}
          isOpen={isNflOpen}
          setIsOpen={setIsNflOpen}
          week={nflWeek}
          setWeek={setNflWeek}
          numberOfWeeks={18}
          scoreboardGroups={[]}
          currentScoreboardGroup=""
          setCurrentScoreboardGroup={() => undefined}
          openGames={openGames}
          toggleOpenGame={toggleOpenGame}
        />
      </div>

      <Footer isOpen={isContactOpen} setIsOpen={setIsContactOpen} />
    </div>
  );
}
