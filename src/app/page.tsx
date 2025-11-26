"use client";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import League from "@/components/League";
import { cfbGroupIdMapping } from "@/lib/espn/transformers";
import Standings from "@/components/Standings";
import useSWR from "swr";

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isCfbOpen, setIsCfbOpen] = useState<boolean>(false);
  const [isNflOpen, setIsNflOpen] = useState<boolean>(false);
  const [nflWeek, setNflWeek] = useState<string>("");
  const [cfbWeek, setCfbWeek] = useState<string>("");
  const [cfbScoreboardGroup, setCfbScoreboardGroup] = useState<string>("-1");
  const [openGames, setOpenGames] = useState<{ [id: string]: boolean }>({});
  const toggleOpenGame = (id: string) => {
    setOpenGames((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data: nflStandings, isLoading: isStatsLoading, } = useSWR(
    "/api/nfl-standings",
    fetcher
  );

  const { data: nflData, isLoading: isNflLoading } = useSWR(
    `/api/games?league=nfl${nflWeek ? `&week=${nflWeek}` : ""}`,
    fetcher,
    { refreshInterval: 10000 }
  );
  const nflGames = nflData?.games ?? [];

  useEffect(() => {
    if (!nflWeek && nflData?.dataWeek) {
      setNflWeek(nflData.dataWeek.toString());
    }
  }, [nflData, nflWeek]);

  // CFB
  const { data: cfbData, isLoading: isCfbLoading } = useSWR(
    `/api/games?league=cfb${
      cfbWeek ? `&week=${cfbWeek}` : ""
    }&scoreboardGroupId=${cfbScoreboardGroup}`,
    fetcher,
    { refreshInterval: 10000 }
  );
  const cfbGames = cfbData?.games ?? [];

  useEffect(() => {
    if (!cfbWeek && cfbData?.dataWeek) {
      setCfbWeek(cfbData.dataWeek.toString());
    }
  }, [cfbData, cfbWeek]);

  return (
    <div className="bg-sky-50 dark:bg-neutral-800 border border-gray-500 divide-y divide-x divide-gray-500">
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
          isLoading={isCfbLoading}
        />
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
          isLoading={isNflLoading}
        />
      </div>

      <Standings standings={nflStandings} isLoading={isStatsLoading} />
      <Footer isOpen={isContactOpen} setIsOpen={setIsContactOpen} />
    </div>
  );
}
