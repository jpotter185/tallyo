interface GameProps {
  game: Game;
}

import Link from "next/link";
import Image from "next/image";

const GameCard: React.FC<GameProps> = ({ game }) => {
  return (
    <div className="border border-gray-100 p-4 rounded-lg shadow-md space-y-4">
      <div className="flex w-full">
        <div className="flex-1 px-1 border border-gray-100">
          <dl>
            <dt><Image src={game.awayTeamLogo}
              alt={`${game.awayTeam} logo`}
              width="36"
              height="36" /></dt>
            <dd className="whitespace-nowrap">{game.awayTeam}</dd>
            <dd>{game.awayTeamRecord}</dd>
          </dl>
        </div>
        <div className="flex-1 px-1 border border-gray-100">
          <dl>
            <dt ><Image src={game.homeTeamLogo}
              alt={`${game.homeTeam} logo`}
              width="36"
              height="36" /></dt>
            <dd className="whitespace-nowrap">{game.homeTeam}</dd>
            <dd>{game.homeTeamRecord}</dd>
          </dl>

        </div>
      </div>
      <div className="flex w-full font-bold text-center">
        <div className="flex-1 border border-gray-100">
          {game.period}
        </div>
      </div>
      <div className="flex w-full font-bold text-center">
        <div className="flex-1 px-1 border border-gray-100">
          {game.awayScore}
        </div>
        <div className="flex-1 px-1  border border-gray-100">{game.homeScore}</div>
      </div>
      {
        game.possessionTeamId &&
        <div className="flex w-full text-center">
          <div className="flex-1 px-1 border border-gray-100">
            {game.possessionTeamId === game.awayTeamId ? game.awayTeam + " have the ball" : game.homeTeam + " have the ball"}
          </div>
        </div>
      }
      {game.currentDownAndDistance &&
        <div className="flex w-full text-center">
          <div className="flex-1 px-1 border border-gray-100">
            {game.currentDownAndDistance}
          </div>
        </div>}
      {game.lastPlay &&
        <div className="flex w-full text-center">
          <div className="flex-1 px-1 border border-gray-100">
            Last Play: {game.lastPlay}
          </div>
        </div>}

      <div>
        <div>{game.location}</div>
        <div>{game.channel}</div>
        <Link
          href={game.espnLink}
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          ESPN Game Page
        </Link>
      </div>
    </div>
  );
};

export default GameCard;
