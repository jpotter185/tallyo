"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import League from "@/components/League";
import Standings from "@/components/Standings";
import { useLeagueState } from "@/components/hooks/useLeagueState";
import { fetcher } from "@/lib/api/fetcher";
import { LEAGUE_CONFIG, LeagueId } from "@/lib/leagues/leagueConfig";
import { CurrentContextResponse } from "@/types/api-contract";
import useSWR from "swr";
import { useEffect, useMemo, useState } from "react";

interface SportPageProps {
  league: LeagueId;
}

function getClosestIsoDate(dates: string[]): string {
  const todayIso = new Date().toLocaleDateString("en-CA");
  if (dates.includes(todayIso)) {
    return todayIso;
  }
  const now = Date.now();
  return dates
    .map((date) => ({
      date,
      diff: Math.abs(new Date(date).getTime() - now),
    }))
    .sort((a, b) => a.diff - b.diff)[0].date;
}

export default function SportPage({ league }: SportPageProps) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [dateOptions, setDateOptions] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const {
    isOpen,
    setIsOpen,
    week,
    setWeek,
    openGames,
    toggleGame,
    seasonType,
    setSeasonType,
    year,
    setYear,
  } = useLeagueState();
  const config = LEAGUE_CONFIG[league];

  const contextUrl =
    config.contextMode === "date"
      ? `/api/context?league=${league}&timezone=${userTimeZone}`
      : `/api/context?league=${league}`;

  const { data: context } = useSWR(contextUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });

  useEffect(() => {
    if (!context || isInitialized) {
      return;
    }

    if (config.contextMode === "date") {
      const parsedDates = Array.isArray(context) ? (context as string[]) : [];
      if (parsedDates.length > 0) {
        setDateOptions(parsedDates);
        setSelectedDate(getClosestIsoDate(parsedDates));
      }
    } else if (
      typeof context === "object" &&
      context !== null &&
      "week" in context &&
      "year" in context &&
      "seasonType" in context
    ) {
      const seasonContext = context as CurrentContextResponse;
      setWeek(String(seasonContext.week));
      setYear(String(seasonContext.year));
      setSeasonType(seasonContext.seasonType.toString());
    }

    setIsInitialized(true);
  }, [
    config.contextMode,
    context,
    isInitialized,
    setSeasonType,
    setWeek,
    setYear,
  ]);

  useEffect(() => {
    if (!isInitialized || config.contextMode !== "season") {
      return;
    }
    const maxWeeks = config.numberOfWeeks.get(seasonType) || 1;
    const currentWeek = parseInt(week || "1", 10);
    if (currentWeek > maxWeeks || currentWeek < 1) {
      setWeek("1");
    }
  }, [
    config.contextMode,
    config.numberOfWeeks,
    isInitialized,
    seasonType,
    setWeek,
    week,
  ]);

  const gamesUrl = useMemo(() => {
    if (!isInitialized) {
      return null;
    }
    if (config.contextMode === "date") {
      if (!selectedDate) {
        return null;
      }
      return `/api/games?league=${league}&date=${selectedDate}&timezone=${userTimeZone}`;
    }
    return `/api/games?league=${league}&week=${week}&seasonType=${seasonType}&year=${year}`;
  }, [
    config.contextMode,
    isInitialized,
    league,
    seasonType,
    selectedDate,
    userTimeZone,
    week,
    year,
  ]);

  const { data: gamesData, isLoading: isGamesLoading } = useSWR(
    gamesUrl,
    fetcher,
  );
  const { data: standings, isLoading: isStandingsLoading } = useSWR(
    config.supportsStandings ? `/api/standings?league=${league}` : null,
    fetcher,
  );

  const customSelectorMap = useMemo(
    () =>
      new Map<string, string>(
        [...dateOptions]
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
          .map((isoDate) => [
            new Date(isoDate).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            new Date(isoDate).toLocaleDateString("en-CA"),
          ]),
      ),
    [dateOptions],
  );

  return (
    <div className="bg-sky-50 dark:bg-neutral-800 border border-gray-500 divide-y divide-x divide-gray-500">
      <Header />
      <div>
        {isInitialized ? (
          <League
            leagueName={config.label}
            games={gamesData ?? []}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            week={week}
            setWeek={setWeek}
            numberOfWeeks={config.numberOfWeeks}
            seasonTypes={config.seasonTypes}
            openGames={openGames}
            toggleOpenGame={toggleGame}
            isLoading={isGamesLoading}
            seasonType={seasonType}
            setSeasonType={setSeasonType}
            setYear={setYear}
            year={year}
            customSelectorMap={customSelectorMap}
            customSelectorValue={selectedDate}
            setCustomSelectorValue={setSelectedDate}
            showYearSelector={config.contextMode === "season"}
            yearOptions={config.yearOptions}
            statsToDisplay={config.statsToDisplay}
          />
        ) : (
          <div>Loading...</div>
        )}
      </div>
      {config.supportsStandings && (
        <Standings
          standings={standings}
          isLoading={isStandingsLoading}
          league={config.label}
        />
      )}
      <Footer isOpen={isContactOpen} setIsOpen={setIsContactOpen} />
    </div>
  );
}
