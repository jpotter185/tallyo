import { Dispatch, SetStateAction, useState } from "react";

interface LeagueState {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  week: string;
  setWeek: Dispatch<SetStateAction<string>>;
  openGames: Record<string, boolean>;
  toggleGame: (id: string) => void;
  seasonType: string;
  setSeasonType: Dispatch<SetStateAction<string>>;
  year: string;
  setYear: Dispatch<SetStateAction<string>>;
}

export function useLeagueState( ): LeagueState {
  const [isOpen, setIsOpen] = useState(false);
  const [week, setWeek] = useState("17");
  const [openGames, setOpenGames] = useState<Record<string, boolean>>({});
  const [seasonType, setSeasonType] = useState("2");
  const [year, setYear] = useState<string>("2025");

  const toggleGame = (id: string) => {
    setOpenGames((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return {
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
  };
}
