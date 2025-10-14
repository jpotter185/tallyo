import Image from "next/image";
import Link from "next/link";
import { dateFormatter } from "@/lib/espn/transformers";

interface GameProps {
  game: Game;
}

const FullSizeGameCard: React.FC<GameProps> = ({ game }) => {
  return (
    <div>
      <div className="grid grid-cols-[3fr_2fr_2fr_2fr_3fr] text-sm place-items-center items-center justify-center">
        {/* Away team info */}
        <div className="flex flex-col">
          <Image
            src={game.awayTeam.logo}
            alt=""
            width={24}
            height={24}
            className="pointer-events-none"
          />
          <div className="text-nowrap">{game.awayTeam.abbreviation}</div>
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
              ? "font-thin text-xs"
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
          {game.shortPeriod !== "Final" &&
            game.gameStatus !== "STATUS_SCHEDULED" && (
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
              ? "font-thin text-xs"
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
          <div className="text-nowrap">{game.homeTeam.abbreviation}</div>
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
      <div className="flex flex-col place-items-center items-center justify-center">
        <div>{game.lastPlay}</div>
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
      {game.stats && (
        <div className="border divide-x divide-y">
          {game.stats?.map((stat) => (
            <div key={stat.name}>
              <div className="border-b p-1">{stat.displayName}</div>
              <div className="p-1">{`${
                stat.teamId === game.awayTeam.id
                  ? game.awayTeam.abbreviation
                  : game.homeTeam.abbreviation
              } ${stat.playerShortName}`}</div>
              <div className="p-1">{stat.displayValue}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FullSizeGameCard;
