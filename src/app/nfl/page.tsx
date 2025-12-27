"use client";
import { useEffect, useState } from "react";
import League from "@/components/League";
import Standings from "@/components/Standings";
import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLeagueState } from "@/components/hooks/useLeagueState";

export default function Nfl() {
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  const nfl = useLeagueState();

  const { data: nflStandings, isLoading: isNflStandingsLoading } = useSWR(
    "/api/standings?league=nfl",
    fetcher
  );

  const { data: nflData, isLoading: isNflLoading } = useSWR(
    `/api/games?league=nfl${nfl.week ? `&week=${nfl.week}` : ""}${nfl.seasonType ? `&seasonType=${nfl.seasonType}` : ""}${nfl.year ? `&year=${nfl.year}` : ""}`,
    fetcher,
    { refreshInterval: 10000 }
  );

  const nflGames = nflData ?? [];

  useEffect(() => {
    if (!nfl.week && nflData?.dataWeek) {
      nfl.setWeek(nflData.dataWeek.toString());
    }
  }, [nflData, nfl]);

  return (
    <div className="bg-sky-50 dark:bg-neutral-800 border border-gray-500 divide-y divide-x divide-gray-500">
      <Header />
      <div>
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
          seasonType={nfl.seasonType}
          setSeasonType={nfl.setSeasonType}
          setYear={nfl.setYear}
          year={nfl.year}
        />
      </div>

      <Standings
        standings={nflStandings}
        isLoading={isNflStandingsLoading}
        league={"NFL"}
      />
      <Footer isOpen={isContactOpen} setIsOpen={setIsContactOpen} />
    </div>
  );
}
