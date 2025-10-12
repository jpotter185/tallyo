import Image from "next/image";

import Link from "next/link";
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
        </div>
        {/* Away team score */}
        <div
          className={` ${
            game.winner && game.winner === game.awayTeam.id
              ? "border-2 border-sky-50 dark:border-neutral-800"
              : ""
          }`}
        >
          {game.awayScore}
          {game.shortPeriod !== "Final" &&
            game.possessionTeamId === game.awayTeam.id && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 120 50"
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block px-1"
              >
                <polygon points="10,25 60,5 110,25 60,45" fill="currentColor" />
              </svg>
            )}
        </div>

        {/* Game info */}
        <div className="flex flex-col whitespace-nowrap">
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
              ? "border-2 border-sky-50 dark:border-neutral-800"
              : ""
          }`}
        >
          {game.possessionTeamId === game.homeTeam.id && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 120 50"
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block"
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
          <div className="text-small">{game.homeTeam.record}</div>
        </div>
      </div>
      <div className="flex flex-col place-items-center items-center justify-center">
        <div>{game.lastPlay}</div>
        {game.gameStatus === "STATUS_SCHEDULED" && <div>{game.date}</div>}
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
