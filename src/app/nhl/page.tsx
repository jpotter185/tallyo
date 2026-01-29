"use client";
import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import { useLeagueState } from "@/components/hooks/useLeagueState";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import League from "@/components/League";
import Header from "@/components/Header";

export default function Nhl() {
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [nhlGamedays, setNhlGamedays] = useState<string[]>([]);
  const [gameday, setGameday] = useState<string>("");

  const nhl = useLeagueState();

  const { data: nhlDates, isLoading: isContextLoading } = useSWR(
    "/api/context?league=nhl",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    },
  );

  useEffect(() => {
    if (nhlDates && nhlDates.length > 0 && !isInitialized) {
      setNhlGamedays(nhlDates);
      setIsInitialized(true);

      const today = new Date().getTime();
      const closestDate = nhlDates
        .map((date: string) => ({
          date,
          diff: Math.abs(new Date(date).getTime() - today),
        }))
        .sort(
          (
            a: { date: string; diff: number },
            b: { date: string; diff: number },
          ) => a.diff - b.diff,
        )[0].date;

      setGameday(closestDate);
    }
  }, [nhlDates, isInitialized]);

  const { data: nhlData, isLoading: isNhlLoading } = useSWR(
    isInitialized ? `/api/games?league=nhl&date=${gameday}` : null,
    fetcher,
  );

  const nhlGames = nhlData ?? [];

  return (
    <div className="bg-sky-50 dark:bg-neutral-800 border border-gray-500 divide-y divide-x divide-gray-500">
      <Header />
      <div>
        {isInitialized ? (
          <League
            leagueName="NHL"
            games={nhlGames}
            isOpen={nhl.isOpen}
            setIsOpen={nhl.setIsOpen}
            week={nhl.week}
            setWeek={nhl.setWeek}
            numberOfWeeks={new Map<string, number>()}
            seasonTypes={new Map<string, string>()}
            openGames={nhl.openGames}
            toggleOpenGame={nhl.toggleGame}
            isLoading={isNhlLoading}
            seasonType={nhl.seasonType}
            setSeasonType={nhl.setSeasonType}
            setYear={nhl.setYear}
            year={nhl.year}
            customSelectorMap={
              new Map<string, string>(
                nhlGamedays
                  .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
                  .map((isoDate) => [
                    new Date(isoDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }),
                    isoDate,
                  ]),
              )
            }
            customSelectorValue={gameday}
            setCustomSelectorValue={setGameday}
          />
        ) : (
          <div>Loading...</div>
        )}
      </div>
      <Footer isOpen={isContactOpen} setIsOpen={setIsContactOpen} />
    </div>
  );
}
