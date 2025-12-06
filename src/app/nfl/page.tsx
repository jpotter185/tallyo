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
    fetcher,
  );

  const { data: nflWeek } = useSWR("/api/week?league=nfl", fetcher);
  useEffect(() => {
    if (nflWeek) {
      nfl.setWeek(nflWeek.toString());
    }
  }, [nflWeek]);

  const { data: nflData, isLoading: isNflLoading } = useSWR(
    `/api/games?league=nfl${nfl.week ? `&week=${nfl.week}` : ""}`,
    fetcher,
    { refreshInterval: 10000 },
  );
  const nflGames = nflData?.games ?? [];

  useEffect(() => {
    if (!nfl.week && nflData?.dataWeek) {
      nfl.setWeek(nflData.dataWeek.toString());
    }
  }, [nflData, nfl.week]);

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
