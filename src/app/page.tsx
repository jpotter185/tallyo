"use client";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import League from "@/components/League";
import { cfbGroupIdMapping } from "@/lib/espn/transformers";
import Standings from "@/components/Standings";
import useSWR from "swr";
import { useCfbState } from "../components/hooks/useCfbState";
import { useLeagueState } from "../components/hooks/useLeagueState";
import { fetcher } from "@/lib/api/fetcher";

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  const cfb = useCfbState();
  const nfl = useLeagueState();

  const { data: nflStandings, isLoading: isStatsLoading } = useSWR(
    "/api/nfl-standings",
    fetcher
  );

  const { data: cfbWeek } = useSWR("/api/week?league=cfb", fetcher);
  useEffect(() => {
    if (cfbWeek) {
      cfb.setWeek(cfbWeek.toString());
    }
  }, [cfbWeek]);

  const { data: nflWeek } = useSWR("/api/week?league=nfl", fetcher);
  useEffect(() => {
    if (nflWeek) {
      nfl.setWeek(nflWeek.toString());
    }
  }, [nflWeek]);

  const { data: nflData, isLoading: isNflLoading } = useSWR(
    `/api/games?league=nfl${nfl.week ? `&week=${nfl.week}` : ""}`,
    fetcher,
    { refreshInterval: 10000 }
  );
  const nflGames = nflData?.games ?? [];

  useEffect(() => {
    if (!nfl.week && nflData?.dataWeek) {
      nfl.setWeek(nflData.dataWeek.toString());
    }
  }, [nflData, nfl.week]);

  const { data: cfbData, isLoading: isCfbLoading } = useSWR(
    `/api/games?league=cfb${
      cfb.week ? `&week=${cfb.week}` : ""
    }&scoreboardGroupId=${cfb.scoreboardGroup}`,
    fetcher,
    { refreshInterval: 10000 }
  );
  const cfbGames = cfbData?.games ?? [];

  useEffect(() => {
    if (!cfb.week && cfbData?.dataWeek) {
      cfb.setWeek(cfbData.dataWeek.toString());
    }
  }, [cfbData, cfb.week]);

  return (
    <div className="bg-sky-50 dark:bg-neutral-800 border border-gray-500 divide-y divide-x divide-gray-500">
      <Header />
      <div>
        <League
          leagueName="CFB"
          games={cfbGames}
          isOpen={cfb.isOpen}
          setIsOpen={cfb.setIsOpen}
          week={cfb.week}
          setWeek={cfb.setWeek}
          numberOfWeeks={16}
          scoreboardGroups={Array.from(cfbGroupIdMapping.keys())}
          currentScoreboardGroup={cfb.scoreboardGroup}
          setCurrentScoreboardGroup={cfb.setScoreboardGroup}
          displayMap={cfbGroupIdMapping}
          openGames={cfb.openGames}
          toggleOpenGame={cfb.toggleGame}
          isLoading={isCfbLoading}
        />
        <League
          leagueName="NFL"
          games={nflGames}
          isOpen={nfl.isOpen}
          setIsOpen={nfl.setIsOpen}
          week={nfl.week}
          setWeek={nfl.setWeek}
          numberOfWeeks={18}
          scoreboardGroups={[]}
          currentScoreboardGroup=""
          setCurrentScoreboardGroup={() => undefined}
          openGames={nfl.openGames}
          toggleOpenGame={nfl.toggleGame}
          isLoading={isNflLoading}
        />
      </div>

      <Standings standings={nflStandings} isLoading={isStatsLoading} />
      <Footer isOpen={isContactOpen} setIsOpen={setIsContactOpen} />
    </div>
  );
}
