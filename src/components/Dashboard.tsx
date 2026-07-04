import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import { currentGamesUrl, leaguesUrl } from "@/lib/api/client";
import {
  buildLeagueConfigs,
  getFallbackLeagueMetadata,
} from "@/lib/leagues/leagueConfig";
import { isLiveDashboardGame } from "@/lib/gameStatus";
import { Game, LeagueMetadata } from "@/types/api-contract";
import GameCard from "./GameCard/GameCard";
import CollapsableSection from "./CollapsableSection";

interface LiveLeagueSectionProps {
  leagueLabel: string;
  statsToDisplay: Map<string, string>;
  games: Game[];
}

const LiveLeagueSection: React.FC<LiveLeagueSectionProps> = ({
  leagueLabel,
  statsToDisplay,
  games,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openGames, setOpenGames] = useState<Record<string, boolean>>({});

  const toggleGame = (id: string) => {
    setOpenGames((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (games.length === 0) {
    return null;
  }

  return (
    <div>
      <CollapsableSection
        title={`Live ${leagueLabel} Games`}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-2">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              isOpen={!!openGames[game.id]}
              toggleOpenGame={() => toggleGame(game.id)}
              statsToDisplay={statsToDisplay}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { data: leaguesMetadata } = useSWR<LeagueMetadata[]>(
    leaguesUrl(),
    fetcher,
  );
  const liveLeagues = buildLeagueConfigs(
    leaguesMetadata ?? getFallbackLeagueMetadata(),
  ).filter((league) => league.showInDashboard);
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { data: liveGamesByLeague, isLoading } = useSWR(
    ["live-games", userTimeZone, ...liveLeagues.map((league) => league.id)],
    async () => {
      const entries = await Promise.all(
        liveLeagues.map(async (league) => {
          const data: Game[] = await fetcher(
            currentGamesUrl(league.id, userTimeZone),
          );
          const games = (data ?? [])
            .filter((game) => isLiveDashboardGame(game))
            .sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            );
          return [league.id, games] as const;
        }),
      );
      return Object.fromEntries(entries) as Record<string, Game[]>;
    },
    { refreshInterval: 10000 },
  );

  const hasAnyLiveGames = liveLeagues.some(
    (league) => (liveGamesByLeague?.[league.id]?.length ?? 0) > 0,
  );

  return (
    <div className="p-4">
      {isLoading ? <div>Loading live games...</div> : null}
      {!isLoading && !hasAnyLiveGames ? (
        <div>No live games right now...</div>
      ) : null}
      {liveLeagues.map((league) => (
        <LiveLeagueSection
          key={league.id}
          leagueLabel={league.label}
          statsToDisplay={league.statsToDisplay}
          games={liveGamesByLeague?.[league.id] ?? []}
        />
      ))}
    </div>
  );
};

export default Dashboard;
