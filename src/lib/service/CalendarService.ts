export interface CalendarEntry {
  label: string;
  alternateLabel?: string;
  detail?: string;
  value: string;
  startDate: string;
  endDate: string;
}

export interface SeasonCalendar {
  label: string;
  value: string;
  startDate: string;
  endDate: string;
  entries?: CalendarEntry[];
}

export interface CalendarResponse {
  calendar: SeasonCalendar[];
  year: string;
  league: string;
}
export default interface CalendarService {
  getCalendar(league: string, year?: string): Promise<CalendarResponse>;
}
