"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import League from "@/components/League";
import Standings from "@/components/Standings";
import { useLeagueState } from "@/components/hooks/useLeagueState";
import { fetcher } from "@/lib/api/fetcher";
import {
  contextUrl,
  gamesUrl,
  leaguesUrl,
  standingsUrl,
} from "@/lib/api/client";
import {
  LeagueId,
  getFallbackLeagueMetadata,
  getLeagueConfigById,
} from "@/lib/leagues/leagueConfig";
import {
  CurrentContext,
  Game,
  LeagueMetadata,
  StandingsGroup,
} from "@/types/api-contract";

interface SportPageProps {
  league: LeagueId;
}

function toLocalIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return [year, month, day].join("-");
}

function parseLocalIsoDate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getClosestIsoDate(dates: string[]): string {
  const todayIso = toLocalIsoDate(new Date());
  if (dates.includes(todayIso)) {
    return todayIso;
  }
  const now = Date.now();
  return dates
    .map((date) => ({
      date,
      diff: Math.abs(parseLocalIsoDate(date).getTime() - now),
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
  const { data: leaguesMetadata } = useSWR<LeagueMetadata[]>(
    leaguesUrl(),
    fetcher,
  );
  const config = getLeagueConfigById(
    league,
    leaguesMetadata ?? getFallbackLeagueMetadata(),
  );
  const hasConfig = !!config;
  const contextMode = config?.contextMode;

  const currentContextUrl = !hasConfig
    ? null
    : contextUrl(
        league,
        contextMode === "date" ? "date" : "season",
        userTimeZone,
      );

  const { data: context } = useSWR(currentContextUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });

  useEffect(() => {
    if (!config || !context || isInitialized) {
      return;
    }

    if (contextMode === "date") {
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
      const seasonContext = context as CurrentContext;
      setWeek(String(seasonContext.week));
      setYear(String(seasonContext.year));
      setSeasonType(seasonContext.seasonType.toString());
    }

    setIsInitialized(true);
  }, [
    contextMode,
    config,
    context,
    isInitialized,
    setSeasonType,
    setWeek,
    setYear,
  ]);

  useEffect(() => {
    if (!config || !isInitialized || contextMode !== "season") {
      return;
    }
    const maxWeeks = config.numberOfWeeks.get(seasonType) || 1;
    const currentWeek = parseInt(week || "1", 10);
    if (currentWeek > maxWeeks || currentWeek < 1) {
      setWeek("1");
    }
  }, [contextMode, config, isInitialized, seasonType, setWeek, week]);

  const currentGamesUrl = useMemo(() => {
    if (!config || !isInitialized) {
      return null;
    }
    if (contextMode === "date") {
      if (!selectedDate) {
        return null;
      }
      return gamesUrl({ league, date: selectedDate, timezone: userTimeZone });
    }
    return gamesUrl({ league, week, seasonType, year });
  }, [
    config,
    contextMode,
    isInitialized,
    league,
    seasonType,
    selectedDate,
    userTimeZone,
    week,
    year,
  ]);

  const { data: gamesData, isLoading: isGamesLoading } = useSWR<Game[]>(
    currentGamesUrl,
    fetcher,
    {
      keepPreviousData: true,
    },
  );
  const { data: standings, isLoading: isStandingsLoading } = useSWR<
    StandingsGroup[]
  >(config?.supportsStandings ? standingsUrl(league) : null, fetcher);

  const customSelectorMap = useMemo(
    () =>
      new Map<string, string>(
        [...dateOptions]
          .sort(
            (a, b) =>
              parseLocalIsoDate(a).getTime() - parseLocalIsoDate(b).getTime(),
          )
          .map((isoDate) => {
            const date = parseLocalIsoDate(isoDate);
            return [
              date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              isoDate,
            ];
          }),
      ),
    [dateOptions],
  );

  return (
    <div className="bg-sky-50 dark:bg-neutral-800 border border-gray-500 divide-y divide-x divide-gray-500">
      <Header />
      {!hasConfig && <div className="p-4">Unknown league: {league}</div>}
      <div>
        {hasConfig ? (
          isInitialized && config ? (
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
          )
        ) : null}
      </div>
      {config?.supportsStandings && (
        <Standings
          standings={standings ?? []}
          isLoading={isStandingsLoading}
          league={config.label}
        />
      )}
      <Footer isOpen={isContactOpen} setIsOpen={setIsContactOpen} />
    </div>
  );
}
