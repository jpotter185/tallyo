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

interface LeagueStateInit {
  week?: string;
  seasonType?: string;
  year?: string;
}

export function useLeagueState(init?: LeagueStateInit): LeagueState {
  const [isOpen, setIsOpen] = useState(false);
  const [week, setWeek] = useState(init?.week ?? "");
  const [openGames, setOpenGames] = useState<Record<string, boolean>>({});
  const [seasonType, setSeasonType] = useState(init?.seasonType ?? "2");
  const [year, setYear] = useState<string>(init?.year ?? "");

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
