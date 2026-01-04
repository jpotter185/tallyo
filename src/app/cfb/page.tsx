"use client";
import { useEffect, useState } from "react";
import League from "@/components/League";
import Standings from "@/components/Standings";
import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLeagueState } from "@/components/hooks/useLeagueState";

export default function Cfb() {
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [contextInitialized, setContextInitialized] = useState<boolean>(false);

  const cfbSeasonTypes = new Map<string, string>([
    ["2", "Regular Season"],
    ["3", "Postseason"],
  ]);

  const cfb = useLeagueState();

  const { data: cfbStandings, isLoading: isCfbStandingsLoading } = useSWR(
    "/api/standings?league=cfb",
    fetcher,
  );

  const { data: context, isLoading: isContextLoading } = useSWR<GameContext>(
    `/api/context?league=cfb`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    },
  );

  useEffect(() => {
    if (context && !contextInitialized) {
      const { year, seasonType, week } = context;
      cfb.setSeasonType(seasonType);
      cfb.setWeek(week);
      cfb.setYear(year);
      setContextInitialized(true);
    }
  }, [context, cfb, contextInitialized]);

  useEffect(() => {
    if (!cfb.seasonType || !context) return;

    if (cfb.seasonType.toString() === context.seasonType.toString()) {
      cfb.setWeek(context.week);
      return;
    }

    // Otherwise use defaults for other season types
    const defaultWeeks: Record<string, string> = {
      "2": "1",
      "3": "1",
    };

    cfb.setWeek(defaultWeeks[cfb.seasonType] || "1");
  }, [cfb.seasonType, context]);

  const { data: cfbData, isLoading: isCfbLoading } = useSWR(
    context
      ? `/api/games?league=cfb&week=${cfb.week}&seasonType=${cfb.seasonType}&year=${cfb.year}`
      : null,
    fetcher,
    { refreshInterval: 10000 },
  );
  const cfbGames = cfbData ?? [];

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
          numberOfWeeks={
            new Map<string, number>([
              ["2", 15],
              ["3", 1],
            ])
          }
          openGames={cfb.openGames}
          toggleOpenGame={cfb.toggleGame}
          isLoading={isCfbLoading}
          seasonType={cfb.seasonType}
          setSeasonType={cfb.setSeasonType}
          year={cfb.year}
          setYear={cfb.setYear}
          seasonTypes={cfbSeasonTypes}
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
