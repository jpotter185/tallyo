"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import { gameDetailsUrl } from "@/lib/api/client";
import { shouldPollGameStats } from "@/lib/gameStatus";
import { Game, GameDetails, StatLeader } from "@/types/api-contract";
import FullsizeGameCard from "./FullSizeGameCard";
import CompactGameCard from "./CompactGameCard";

interface GameProps {
  game: Game;
  isOpen: boolean;
  toggleOpenGame: () => void;
  statsToDisplay: Map<string, string>;
}

const GameCard: React.FC<GameProps> = ({
  game,
  isOpen,
  toggleOpenGame,
  statsToDisplay,
}) => {
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isScoringPlaysOpen, setIsScoringPlaysOpen] = useState(false);
  const [isTeamStatsOpen, setIsTeamStatsOpen] = useState(false);
  const [isPlayersOpen, setIsPlayersOpen] = useState(false);

  const { data: details } = useSWR<GameDetails>(
    gameDetailsUrl(game.id),
    fetcher,
    shouldPollGameStats(game.gameStatus)
      ? { refreshInterval: 10000 }
      : undefined,
  );

  const leaders = new Map<string, StatLeader>(
    (details?.leaders ?? []).map((leader) => [
      `${leader.name}-${leader.teamId}`,
      leader,
    ]),
  );

  return (
    <div
      className={`border border-gray-300 dark:border-gray-500 p-5 rounded-lg shadow-lg bg-neutral-300 dark:bg-neutral-500 transition-transform duration-300 ${
        isOpen ? "p-2" : "p-1 scale-[0.99]"
      } cursor-pointer`}
      onClick={toggleOpenGame}
    >
      {isOpen ? (
        <FullsizeGameCard
          game={game}
          leaders={leaders}
          scoringPlays={details?.scoringPlays ?? []}
          isScoringPlaysOpen={isScoringPlaysOpen}
          toggleScoringPlays={() => setIsScoringPlaysOpen((open) => !open)}
          isStatsOpen={isStatsOpen}
          toggleStats={() => setIsStatsOpen((open) => !open)}
          isTeamStatsOpen={isTeamStatsOpen}
          toggleTeamStats={() => setIsTeamStatsOpen((open) => !open)}
          playerGroups={details?.players ?? []}
          isPlayersOpen={isPlayersOpen}
          togglePlayers={() => setIsPlayersOpen((open) => !open)}
          statsToDisplay={statsToDisplay}
        />
      ) : (
        <CompactGameCard game={game} />
      )}
    </div>
  );
};

export default GameCard;
