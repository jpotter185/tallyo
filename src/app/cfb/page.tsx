"use client";
import { useEffect, useState } from "react";
import League from "@/components/League";
import Standings from "@/components/Standings";
import useSWR from "swr";
import { useCfbState } from "../../components/hooks/useCfbState";
import { fetcher } from "@/lib/api/fetcher";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cfbGroupIdMapping } from "@/lib/espn/enums/cfbScoreboardGroupIds";

export default function Cfb() {
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  const cfb = useCfbState();

  const { data: cfbStandings, isLoading: isCfbStandingsLoading } = useSWR(
    "/api/standings?league=cfb",
    fetcher,
  );

  const { data: cfbWeek } = useSWR("/api/week?league=cfb", fetcher);
  useEffect(() => {
    if (cfbWeek) {
      cfb.setWeek(cfbWeek.toString());
    }
  }, [cfbWeek]);

  const { data: cfbData, isLoading: isCfbLoading } = useSWR(
    `/api/games?league=cfb${
      cfb.week ? `&week=${cfb.week}` : ""
    }&scoreboardGroupId=${cfb.scoreboardGroup}`,
    fetcher,
    { refreshInterval: 10000 },
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
          numberOfWeeks={19}
          scoreboardGroups={Array.from(cfbGroupIdMapping.keys())}
          currentScoreboardGroup={cfb.scoreboardGroup}
          setCurrentScoreboardGroup={cfb.setScoreboardGroup}
          displayMap={cfbGroupIdMapping}
          openGames={cfb.openGames}
          toggleOpenGame={cfb.toggleGame}
          isLoading={isCfbLoading}
        />
      </div>
      <Standings
        standings={cfbStandings}
        isLoading={isCfbStandingsLoading}
        league={"CFB"}
      />
      <Footer isOpen={isContactOpen} setIsOpen={setIsContactOpen} />
    </div>
  );
}
