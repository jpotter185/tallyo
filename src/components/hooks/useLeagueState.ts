import { Dispatch, SetStateAction, useState } from "react";

interface LeagueState {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  week: string;
  setWeek: Dispatch<SetStateAction<string>>;
  openGames: Record<string, boolean>;
  toggleGame: (id: string) => void;
}

export function useLeagueState(defaultWeek = ""): LeagueState {
  const [isOpen, setIsOpen] = useState(false);
  const [week, setWeek] = useState(defaultWeek);
  const [openGames, setOpenGames] = useState<Record<string, boolean>>({});

  const toggleGame = (id: string) => {
    setOpenGames((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return { isOpen, setIsOpen, week, setWeek, openGames, toggleGame };
}
