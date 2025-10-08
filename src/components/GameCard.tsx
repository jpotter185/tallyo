interface GameProps {
  game: Game;
}

import Link from "next/link";
import Image from "next/image";

const GameCard: React.FC<GameProps> = ({ game }) => {
  return (
    <div className="border border-gray-300 dark:border-gray-500 p-5 rounded-lg shadow-lg space-y-4 bg-neutral-300 dark:bg-neutral-500">
      <div className="border border-gray-500 dark:border-neutral-800 divide-y divide-gray-500 dark:divide-neutral-800">
        <div className="grid grid-cols-2 font-bold divide-x divide-gray-500 dark:divide-neutral-800">
          <div className="flex-1 px-1">
            <dl>
              {game.awayTeam.logo && (
                <dt>
                  <Image
                    src={game.awayTeam.logo}
                    alt={`${game.awayTeam} logo`}
                    width="36"
                    height="36"
                  />
                </dt>
              )}
              <dd>{game.awayTeam.name}</dd>
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
                  />
                </dt>
              )}
              <dd>{game.homeTeam.name}</dd>
              <dd className="text-sm">{game.homeTeam.record}</dd>
            </dl>
          </div>
        </div>
        {game.awayScore && game.homeScore && (
          <div className="grid grid-cols-2 font-bold text-center divide-x divide-gray-500 dark:divide-neutral-800">
            <div
              className={`flex-1 px-1 ${
                game.winner && game.winner === game.awayTeam.id
                  ? "bg-green-400 dark:bg-green-800"
                  : ""
              }`}
            >
              {game.awayScore}
            </div>
            <div
              className={`flex-1 px-1 ${
                game.winner && game.winner === game.homeTeam.id
                  ? "bg-green-400 dark:bg-green-800"
                  : ""
              }`}
            >
              {game.homeScore}
            </div>
          </div>
        )}

        {game.odds && <div className="text-center flex-1">{game.odds}</div>}
        {game.period && <div className="text-center flex-1">{game.period}</div>}
        {game.currentDownAndDistance && (
          <div
            className="text-center flex-1"
            style={{
              backgroundColor: `#${
                game.possessionTeamId === game.homeTeam.id
                  ? game.homeTeam.primaryColor
                  : game.possessionTeamId === game.awayTeam.id
                  ? game.awayTeam.primaryColor
                  : "0"
              }`,
            }}
          >
            {game.currentDownAndDistance}
          </div>
        )}

        {game.lastPlay && (
          <div className="text-center flex-1">Last Play: {game.lastPlay}</div>
        )}
      </div>
      <div>
        {game.headline && <div>{game.headline}</div>}
        <div>{game.channel}</div>
        <div>{game.stadiumName}</div>
        <div>{game.location}</div>
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

export default GameCard;
