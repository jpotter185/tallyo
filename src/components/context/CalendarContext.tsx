"use client";

import { createContext, useContext, ReactNode } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";

interface CalendarContextType {
  nflCalendar: any[];
  cfbCalendar: any[];
  isLoading: boolean;
  fetchCalendarForYear: (league: "nfl" | "cfb", year: number) => any[];
}

interface WeekEntry {
  label: string;
  alternateLabel: string;
  detail: string;
  value: string;
  startDate: string;
  endDate: string;
}

interface Calendar {
  label: string;
  value: string;
  startDate: string;
  endDate: string;
  entries: WeekEntry[];
}

export interface WeekDetail {
  seasonType: string;
  week: string;
  year: string;
  startDate: string;
  endDate: string;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const currentYear = new Date().getFullYear();

  const { data: nflData, isLoading: nflLoading } = useSWR(
    `/api/calendar?league=nfl&year=${currentYear}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { data: cfbData, isLoading: cfbLoading } = useSWR(
    `/api/calendar?league=college-football&year=${currentYear}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const fetchCalendarForYear = (league: "nfl" | "cfb", year: number) => {
    if (year === currentYear) {
      return league === "nfl"
        ? nflData?.calendar || []
        : cfbData?.calendar || [];
    }
    return [];
  };

  return (
    <CalendarContext.Provider
      value={{
        nflCalendar: nflData?.calendar || [],
        cfbCalendar: cfbData?.calendar || [],
        isLoading: nflLoading || cfbLoading,
        fetchCalendarForYear,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
}

export function getWeekDateRange(
  calendar: any[],
  seasonType: string,
  week: string
) {
  const seasonCalendar = calendar.find((cal) => cal.value === seasonType);
  if (!seasonCalendar) return null;

  const weekEntry = seasonCalendar.entries?.find(
    (entry: any) => entry.value === week
  );

  return weekEntry
    ? {
        startDate: new Date(weekEntry.startDate)
          .toISOString()
          .split("T")[0]
          .replace(/-/g, ""),
        endDate: new Date(weekEntry.endDate)
          .toISOString()
          .split("T")[0]
          .replace(/-/g, ""),
      }
    : null;
}

export function getWeekDetailForDate(
  calendars: Calendar[],
  date = new Date().toISOString()
): WeekDetail {
  const now = new Date(date).getTime();
  for (const season of calendars) {
    for (const week of season.entries) {
      if (
        new Date(week.startDate).getTime() <= now &&
        new Date(week.endDate).getTime() > now
      ) {
        return {
          seasonType: season.label,
          year: new Date().getFullYear().toString(),
          week: week.label,
          startDate: new Date(week.startDate).toISOString(),
          endDate: new Date(week.endDate).toISOString(),
        };
      }
    }
  }

  return {
    seasonType: "",
    year: new Date().getFullYear().toString(),
    week: "",
    startDate: "",
    endDate: "",
  };
}
