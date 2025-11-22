import Image from "next/image";
import Link from "next/link";
import { dateFormatter } from "@/lib/espn/transformers";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

interface GameProps {
  game: Game;
  getStatsForGame: (
    game: Game
  ) => Promise<{ stats: Map<string, Stat>; scoringPlays: ScoringPlay[] }>;
  isOpen: boolean;
  openScoringPlaysForGame: () => void;
  isScoringPlaysOpen: boolean;
  openStatsForGame: () => void;
  isStatsOpen: boolean;
}

const FullSizeGameCard: React.FC<GameProps> = ({
  game,
  getStatsForGame,
  isOpen,
  openScoringPlaysForGame,
  isScoringPlaysOpen,
  openStatsForGame,
  isStatsOpen,
}) => {
  const [stats, setStats] = useState<Map<string, Stat> | null>(null);
  const [scoringPlays, setScoringPlays] = useState<ScoringPlay[] | null>(null);

  useEffect(() => {
    const handleHover = async () => {
      const fetched = await getStatsForGame(game);
      setStats(fetched.stats);
      setScoringPlays(fetched.scoringPlays);
    };
    if (isOpen) {
      handleHover();
    }
    const interval = setInterval(handleHover, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const gameStatNameTracker = new Set<string>();
  const defaultStat: Stat = {
    name: "",
    displayName: "",
    shortDisplayName: "",
    abbreviation: "",
    value: "",
    displayValue: "",
    playerName: "",
    playerShortName: "",
    teamId: "",
  };
  return (
    <div>
      <div className="grid grid-cols-[3fr_2fr_2fr_2fr_3fr] place-items-center items-center justify-center p-2">
        {/* Away team info */}
        <div className="flex flex-col">
          <Image
            src={game.awayTeam.logo}
            alt=""
            width={24}
            height={24}
            className="pointer-events-none"
          />
          <div className="text-nowrap">
            {game.awayTeam.ranking
              ? game.awayTeam.ranking + game.awayTeam.abbreviation
              : game.awayTeam.abbreviation}
          </div>
          <div className="text-xs">{game.awayTeam.record}</div>
          {game.awayTimeouts && game.league === "nfl" && (
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-1 rounded-full ${
                    i < game.awayTimeouts
                      ? "bg-current"
                      : "border border-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        {/* Away team score */}
        <div
          className={` ${
            game.winner && game.winner === game.awayTeam.id
              ? "font-extrabold"
              : game.winner
              ? "font-thin"
              : ""
          }`}
        >
          {game.awayScore}
          {game.shortPeriod !== "Final" &&
            game.possessionTeamId === game.awayTeam.id && (
              <svg
                width="20"
                height="20"
                viewBox="0 0 120 50"
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block px-1 text-base"
              >
                <polygon points="10,25 60,5 110,25 60,45" fill="currentColor" />
              </svg>
            )}
        </div>

        {/* Game info */}
        <div className="flex flex-col whitespace-nowrap place-items-center items-center justify-center">
          {game.gameStatus !== "STATUS_SCHEDULED" && (
            <div>{game.shortPeriod}</div>
          )}
          {game.shortPeriod !== "Final" &&
            game.gameStatus !== "STATUS_SCHEDULED" && (
              <div className="text-xs">{game.down}</div>
            )}
          {game.shortPeriod !== "Final" &&
            game.gameStatus !== "STATUS_SCHEDULED" && (
              <div className="text-xs">{game.ballLocation}</div>
            )}
          {game.shortPeriod !== "Final" && (
            <div className="text-xs">{game.channel}</div>
          )}
        </div>
        {/* Home team score */}
        <div
          className={` ${
            game.winner && game.winner === game.homeTeam.id
              ? "font-extrabold"
              : game.winner
              ? "font-thin"
              : ""
          }`}
        >
          {game.possessionTeamId === game.homeTeam.id && (
            <svg
              width="20"
              height="20"
              viewBox="0 0 120 50"
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block px-1"
            >
              <polygon points="10,25 60,5 110,25 60,45" fill="currentColor" />
            </svg>
          )}
          {game.homeScore}
        </div>
        {/* home team info */}
        <div className="flex flex-col">
          <Image
            src={game.homeTeam.logo}
            alt=""
            width={24}
            height={24}
            className="pointer-events-none"
          />
          <div className="text-nowrap">
            {game.homeTeam.ranking
              ? game.homeTeam.ranking + game.homeTeam.abbreviation
              : game.homeTeam.abbreviation}
          </div>
          <div className="text-xs">{game.homeTeam.record}</div>
          {game.homeTimeouts && game.league === "nfl" && (
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-1 rounded-full ${
                    i < game.homeTimeouts
                      ? "bg-current"
                      : "border border-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {game.lastPlay && (
        <div className="p-2 flex flex-col place-items-center items-center justify-center">
          Last Play:
          <div>{game.lastPlay}</div>
        </div>
      )}
      {game.lastPlay && game.awayWinPercentage && game.homeWinPercentage && (
        <div>
          {game.awayWinPercentage > game.homeWinPercentage ? (
            <div className="p-2 flex flex-col place-items-center items-center justify-center">
              {game.awayTeam.abbreviation} chance to win:
              <div>
                {(Number(game.awayWinPercentage) * 100).toFixed(1) + "%"}
              </div>
            </div>
          ) : (
            <div className="p-2 flex flex-col place-items-center items-center justify-center">
              {game.homeTeam.abbreviation} chance to win:
              <div>
                {(Number(game.homeWinPercentage) * 100).toFixed(1) + "%"}
              </div>
            </div>
          )}
        </div>
      )}
      {scoringPlays && scoringPlays.length > 0 && (
        <div
          className="flex w-full items-center justify-between p-2"
          onClick={(e) => {
            e.stopPropagation();
            openScoringPlaysForGame();
          }}
        >
          <div className="p-1">Scoring Plays</div>
          <ChevronDown
            textAnchor="end"
            className={`w-5 h-5 transition-transform duration-300 ${
              isScoringPlaysOpen ? "rotate-180" : ""
            }`}
          ></ChevronDown>
        </div>
      )}
      {isScoringPlaysOpen && (
        <div className="border rounded overflow-hidden divide-y">
          {scoringPlays?.map((play) => {
            return (
              <div className="p-1" key={play.id}>
                <div>
                  {play.quarter}Q - {play.clock}
                </div>
                <div>
                  {play.teamName} {play.scoringType} - {play.displayText}
                </div>
                <div>
                  {game.awayTeam.abbreviation} {play.awayScore} -{" "}
                  {play.homeScore} {game.homeTeam.abbreviation}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {stats && stats.size > 0 && (
        <div
          className="flex w-full items-center justify-between p-2"
          onClick={(e) => {
            e.stopPropagation();
            openStatsForGame();
          }}
        >
          <div className="p-1">Stats</div>
          <ChevronDown
            textAnchor="end"
            className={`w-5 h-5 transition-transform duration-300 ${
              isStatsOpen ? "rotate-180" : ""
            }`}
          ></ChevronDown>
        </div>
      )}
      {isStatsOpen && stats && (
        <div className="border rounded overflow-hidden divide-y">
          <div className="grid grid-cols-3 text-center divide-x font-semibold">
            <div>{game.awayTeam.abbreviation}</div>
            <div>Stat</div>
            <div>{game.homeTeam.abbreviation}</div>
          </div>
          {Array.from(stats.keys()).map((stat) => {
            const statName = stat.split("-")[0];
            if (!statName || gameStatNameTracker.has(statName)) {
              return;
            } else {
              gameStatNameTracker.add(statName);
              let homeStat: Stat | undefined = stats.get(
                `${statName}-${game.homeTeam.id}`
              );
              if (!homeStat) {
                homeStat = defaultStat;
              }
              let awayStat: Stat | undefined = stats.get(
                `${statName}-${game.awayTeam.id}`
              );
              if (!awayStat) {
                awayStat = defaultStat;
              }
              if (awayStat.name === "" && homeStat.name === "") {
                return;
              }
              return (
                <div
                  key={statName}
                  className="grid grid-cols-3 text-center divide-x"
                >
                  <div>
                    <div>{awayStat.playerShortName}</div>
                    <div>{awayStat.displayValue}</div>
                  </div>
                  <div>{awayStat.displayName || homeStat.displayName}</div>
                  <div>
                    <div>{homeStat.playerShortName}</div>
                    <div>{homeStat.displayValue}</div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}
      <div className="flex flex-col place-items-center items-center justify-center">
        <div>{game.odds}</div>
        {game.gameStatus === "STATUS_SCHEDULED" && (
          <div>{dateFormatter.format(new Date(game.isoDate))}</div>
        )}
        <div>
          <Link
            href={game.espnLink}
            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
            target="_blank"
          >
            ESPN
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FullSizeGameCard;
