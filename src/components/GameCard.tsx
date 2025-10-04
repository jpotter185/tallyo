interface GameProps {
  game: Game;
}

import Link from "next/link";
import Image from "next/image";

const GameCard: React.FC<GameProps> = ({ game }) => {
  return (
    <div>
      <div className="flex w-full ">
        <div className="flex-1">
          <dl>
            <dt><Image src={game.awayTeamLogo}
              alt={`${game.awayTeam} logo`}
              width="36"
              height="36" /></dt>
            <dd>{game.awayTeam}</dd>
          </dl>
        </div>
        <div className="flex-1">
          <dl>
            <dt ><Image src={game.homeTeamLogo}
              alt={`${game.homeTeam} logo`}
              width="36"
              height="36" /></dt>
            <dd >{game.homeTeam}</dd>
          </dl>

        </div>
      </div>
      <div className="flex w-full">
        <div className="flex-1">
          {game.awayScore}
        </div>
        <div className="flex-1">{game.homeScore}</div>
      </div>
      <div>
        <div>{game.period}</div>
        <div>{game.lastPlay}</div>
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
