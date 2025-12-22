// context/CalendarContext.tsx
"use client";

import { createContext, useContext, ReactNode } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";

interface CalendarContextType {
  nflCalendar: any[];
  cfbCalendar: any[];
  isLoading: boolean;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined,
);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const currentYear = new Date().getFullYear();

  const { data: nflData, isLoading: nflLoading } = useSWR(
    `/api/calendar?league=nfl&year=${currentYear}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const { data: cfbData, isLoading: cfbLoading } = useSWR(
    `/api/calendar?league=college-football&year=${currentYear}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return (
    <CalendarContext.Provider
      value={{
        nflCalendar: nflData?.calendar || [],
        cfbCalendar: cfbData?.calendar || [],
        isLoading: nflLoading || cfbLoading,
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

// Helper function to get date range
export function getWeekDateRange(
  calendar: any[],
  seasonType: string,
  week: string,
) {
  const seasonCalendar = calendar.find((cal) => cal.value === seasonType);
  if (!seasonCalendar) return null;

  const weekEntry = seasonCalendar.entries?.find(
    (entry: any) => entry.value === week,
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
