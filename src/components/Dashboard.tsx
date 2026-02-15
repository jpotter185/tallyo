import { fetcher } from "@/lib/api/fetcher";
import {
  LEAGUE_CONFIG,
  LEAGUE_IDS,
  LeagueId,
} from "@/lib/leagues/leagueConfig";
import { isLiveDashboardGame } from "@/lib/gameStatus";
import { useState } from "react";
import useSWR from "swr";
import GameCard from "./GameCard/GameCard";
import CollapsableSection from "./CollapsableSection";

interface LiveLeagueSectionProps {
  league: LeagueId;
  games: Game[];
}

const LiveLeagueSection: React.FC<LiveLeagueSectionProps> = ({
  league,
  games,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openGames, setOpenGames] = useState<Record<string, boolean>>({});
  const config = LEAGUE_CONFIG[league];

  const toggleGame = (id: string) => {
    setOpenGames((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (games.length === 0) {
    return null;
  }

  return (
    <div>
      <CollapsableSection
        title={`Live ${config.label} Games`}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-2">
          {games.map((game) => {
            return (
              <GameCard
                key={game.id}
                game={game}
                isOpen={!!openGames[game.id]}
                toggleOpenGame={() => toggleGame(game.id)}
                statsToDisplay={config.statsToDisplay}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const liveLeagues = LEAGUE_IDS.filter(
    (id) => LEAGUE_CONFIG[id].showInDashboard,
  );
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { data: liveGamesByLeague, isLoading } = useSWR(
    ["live-games", userTimeZone, ...liveLeagues],
    async () => {
      const entries = await Promise.all(
        liveLeagues.map(async (league) => {
          const data = await fetcher(
            `/api/games/current?league=${league}&timezone=${userTimeZone}`,
          );
          const games: Game[] = (data ?? [])
            .filter((game: Game) => isLiveDashboardGame(game))
            .sort((a: Game, b: Game) => {
              return new Date(a.date).getTime() - new Date(b.date).getTime();
            });
          return [league, games] as const;
        }),
      );
      return Object.fromEntries(entries) as Record<LeagueId, Game[]>;
    },
    { refreshInterval: 10000 },
  );

  const hasAnyLiveGames = liveLeagues.some(
    (league) => (liveGamesByLeague?.[league]?.length ?? 0) > 0,
  );

  return (
    <div className="p-4">
      {isLoading ? <div>Loading live games...</div> : null}
      {!isLoading && !hasAnyLiveGames ? (
        <div>No live games right now...</div>
      ) : null}
      {liveLeagues.map((league) => (
        <LiveLeagueSection
          key={league}
          league={league}
          games={liveGamesByLeague?.[league] ?? []}
        />
      ))}
    </div>
  );
};

export default Dashboard;
