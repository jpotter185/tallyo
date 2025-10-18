import Image from "next/image";
import { dateFormatter } from "@/lib/espn/transformers";

interface GameCompactProps {
  game: Game;
}

const CompactGameCard: React.FC<GameCompactProps> = ({ game }) => {
  return (
    <div>
      <div
        className={`grid grid-cols-[auto_1fr_auto] items-center gap-1 p-1 ${
          game.winner && game.winner === game.awayTeam.id
            ? "border-2 border-sky-50 dark:border-neutral-800"
            : ""
        }`}
      >
        <Image
          src={game.awayTeam.logo}
          alt=""
          width={24}
          height={24}
          className="pointer-events-none"
        />
        <div className="flex items-center gap-1 font-bold text-sm">
          <div>
            {game.awayTeam.ranking
              ? game.awayTeam.ranking + game.awayTeam.abbreviation
              : game.awayTeam.abbreviation}
          </div>
          {game.possessionTeamId === game.awayTeam.id && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 120 50"
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block text-base"
            >
              <polygon points="10,25 60,5 110,25 60,45" fill="currentColor" />
            </svg>
          )}
        </div>
        <div>{game.awayScore}</div>
      </div>
      <div
        className={`grid grid-cols-[auto_1fr_auto] items-center gap-2 p-1 ${
          game.winner && game.winner === game.homeTeam.id
            ? "border-2 border-sky-50 dark:border-neutral-800"
            : ""
        }`}
      >
        <Image
          src={game.homeTeam.logo}
          alt=""
          width={24}
          height={24}
          className="pointer-events-none"
        />
        <div className="flex items-center gap-1 font-bold text-sm">
          <div>
            {game.homeTeam.ranking
              ? game.homeTeam.ranking + game.homeTeam.abbreviation
              : game.homeTeam.abbreviation}
          </div>
          {game.possessionTeamId === game.homeTeam.id && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 120 50"
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block text-base"
            >
              <polygon points="10,25 60,5 110,25 60,45" fill="currentColor" />
            </svg>
          )}
        </div>
        <div>{game.homeScore}</div>
      </div>
      <div className="flex flex-col">
        {game.gameStatus !== "STATUS_SCHEDULED" && (
          <div>{game.shortPeriod}</div>
        )}
        {game.gameStatus === "STATUS_SCHEDULED" && (
          <div>{dateFormatter.format(new Date(game.isoDate))}</div>
        )}
        {game.shortPeriod !== "Final" && <div>{game.channel}</div>}
      </div>
    </div>
  );
};

export default CompactGameCard;
