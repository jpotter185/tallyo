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
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const numberOfWeeks = new Map<string, number>([
    ["1", 4],
    ["2", 18],
    ["3", 5],
  ]);

  const nflSeasonTypes = new Map<string, string>([
    ["1", "Preseason"],
    ["2", "Regular Season"],
    ["3", "Postseason"],
  ]);

  const { data: context, isLoading: isContextLoading } = useSWR<GameContext>(
    `/api/context?league=nfl`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    },
  );

  useEffect(() => {
    if (context && !isInitialized) {
      nfl.setWeek(context.week);
      nfl.setYear(context.year);
      nfl.setSeasonType(context.seasonType.toString());
      setIsInitialized(true);
    }
  }, [context, isInitialized]);

  const nfl = useLeagueState();

  useEffect(() => {
    if (isInitialized) {
      const maxWeeks = numberOfWeeks.get(nfl.seasonType.toString()) || 1;
      const currentWeek = parseInt(nfl.week);
      if (currentWeek > maxWeeks) {
        nfl.setWeek("1");
      }
    }
  }, [nfl.seasonType, isInitialized]);

  const { data: nflStandings, isLoading: isNflStandingsLoading } = useSWR(
    "/api/standings?league=nfl",
    fetcher,
  );

  const { data: nflData, isLoading: isNflLoading } = useSWR(
    isInitialized
      ? `/api/games?league=nfl&week=${nfl.week}&seasonType=${nfl.seasonType}&year=${nfl.year}`
      : null,
    fetcher,
  );

  const nflGames = nflData ?? [];

  return (
    <div className="bg-sky-50 dark:bg-neutral-800 border border-gray-500 divide-y divide-x divide-gray-500">
      <Header />
      <div>
        {isInitialized ? (
          <League
            leagueName="NFL"
            games={nflGames}
            isOpen={nfl.isOpen}
            setIsOpen={nfl.setIsOpen}
            week={nfl.week}
            setWeek={nfl.setWeek}
            numberOfWeeks={
              new Map<string, number>([
                ["1", 4],
                ["2", 18],
                ["3", 5],
              ])
            }
            seasonTypes={nflSeasonTypes}
            openGames={nfl.openGames}
            toggleOpenGame={nfl.toggleGame}
            isLoading={isNflLoading}
            seasonType={nfl.seasonType}
            setSeasonType={nfl.setSeasonType}
            setYear={nfl.setYear}
            year={nfl.year}
          />
        ) : (
          <div>Loading...</div>
        )}
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
