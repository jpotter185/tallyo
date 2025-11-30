import { useState } from "react";
import { useLeagueState } from "./useLeagueState";

export function useCfbState(defaultWeek = "", defaultGroup = "-1") {
  const league = useLeagueState(defaultWeek);
  const [scoreboardGroup, setScoreboardGroup] = useState(defaultGroup);
  return { ...league, scoreboardGroup, setScoreboardGroup };
}
