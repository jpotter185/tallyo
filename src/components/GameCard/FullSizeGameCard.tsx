import Image from "next/image";

import Link from "next/link";
interface GameProps {
  game: Game;
}

const FullSizeGameCard: React.FC<GameProps> = ({ game }) => {
  return (
    <div>
      <div className="border border-gray-500 dark:border-neutral-800 divide-y divide-gray-500 dark:divide-neutral-800">
        <div className="grid grid-cols-2 divide-x divide-gray-500 dark:divide-neutral-800">
          <div className="flex-1 px-1">
            <dl>
              {game.awayTeam.logo && (
                <dt>
                  <Image
                    src={game.awayTeam.logo}
                    alt={`${game.awayTeam} logo`}
                    width="36"
                    height="36"
                    className="pointer-events-none"
                  />
                </dt>
              )}
              <dd className="font-bold ">
                {game.awayTeam.name &&
                game.possessionTeamId === game.awayTeam.id
                  ? game.awayTeam.name + " ▶"
                  : game.awayTeam.name}
              </dd>

              <dd className="text-sm">{game.awayTeam.record}</dd>
            </dl>
          </div>
          <div className="flex-1 px-1">
            <dl>
              {game.homeTeam.logo && (
                <dt>
                  <Image
                    src={game.homeTeam.logo}
                    alt={`${game.homeTeam} logo`}
                    width="36"
                    height="36"
                    className="pointer-events-none"
                  />
                </dt>
              )}
              <dd className="font-bold ">
                {game.homeTeam.name &&
                game.possessionTeamId === game.homeTeam.id
                  ? game.homeTeam.name + " ▶"
                  : game.homeTeam.name}
              </dd>

              <dd className="text-sm">{game.homeTeam.record}</dd>
            </dl>
          </div>
        </div>
        {game.awayScore && game.homeScore && (
          <div className="grid grid-cols-2 font-bold text-center divide-x divide-gray-500 dark:divide-neutral-800">
            <div
              className={`flex-1 px-1 ${
                game.winner && game.winner === game.awayTeam.id
                  ? "underline"
                  : ""
              }`}
            >
              {game.awayScore}
            </div>
            <div
              className={`flex-1 px-1 ${
                game.winner && game.winner === game.homeTeam.id
                  ? "underline"
                  : ""
              }`}
            >
              {game.homeScore}
            </div>
          </div>
        )}
        {game.odds && <div className="text-center flex-1">{game.odds}</div>}
        {game.period &&
          game.gameStatus !== "STATUS_SCHEDULED" &&
          game.gameStatus !== "STATUS_FINAL" && (
            <div className="text-center flex-1">
              {game.period}
              {game.channel && "on " + game.channel}
            </div>
          )}
        {game.currentDownAndDistance && (
          <div className="text-center flex-1">
            {game.currentDownAndDistance}
          </div>
        )}
        {game.lastPlay && (
          <div className="text-center flex-1">Last Play: {game.lastPlay}</div>
        )}
      </div>
      <div>
        {game.gameStatus === "STATUS_SCHEDULED" && <div>{game.date}</div>}
        {game.headline && <div>{game.headline}</div>}
        {game.channel && <div>{game.channel}</div>}
        {<div>{game.stadiumName}</div>}
        {<div>{game.location}</div>}

        <Link
          href={game.espnLink}
          className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
          target="_blank"
        >
          ESPN Game Page
        </Link>
      </div>
    </div>
  );
};

export default FullSizeGameCard;
