"use client";

interface GameProps {
  game: Game;
  isOpen: boolean;
  toggleOpenGame: () => void;
}

import Link from "next/link";
import Image from "next/image";

const GameCard: React.FC<GameProps> = ({ game, isOpen, toggleOpenGame }) => {
  return (
    <div
      className={`border border-gray-300 dark:border-gray-500 p-5 rounded-lg shadow-lg bg-neutral-300 dark:bg-neutral-500 transition-transform duration-300 ${
        isOpen ? "p-5" : "p-3 scale-[0.99]"
      } cursor-pointer`}
      onClick={toggleOpenGame}
    >
      <div className="border border-gray-500 dark:border-neutral-800 divide-y divide-gray-500 dark:divide-neutral-800">
        <div className="grid grid-cols-2 divide-x divide-gray-500 dark:divide-neutral-800">
          <div className="flex-1 px-1">
            {isOpen ? (
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
                    ? game.awayTeam.name + " 🏈"
                    : game.awayTeam.name}
                </dd>

                <dd className="text-sm">{game.awayTeam.record}</dd>
              </dl>
            ) : (
              <div className="flex items-center space-x-2">
                <Image
                  src={game.awayTeam.logo}
                  alt=""
                  width={24}
                  height={24}
                  className="pointer-events-none"
                />
                <span className="font-bold text-sm">
                  {game.awayTeam.abbreviation}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 px-1">
            {isOpen ? (
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
                {isOpen && (
                  <dd className="font-bold ">
                    {game.homeTeam.name &&
                    game.possessionTeamId === game.homeTeam.id
                      ? game.homeTeam.name + " 🏈"
                      : game.homeTeam.name}
                  </dd>
                )}
                {!isOpen && (
                  <dd className="font-bold ">
                    {game.homeTeam.name &&
                    game.possessionTeamId === game.homeTeam.id
                      ? game.homeTeam.abbreviation + " 🏈"
                      : game.homeTeam.abbreviation}
                  </dd>
                )}
                <dd className="text-sm">{game.homeTeam.record}</dd>
              </dl>
            ) : (
              <div className="flex items-center space-x-2">
                <Image
                  src={game.homeTeam.logo}
                  alt=""
                  width={24}
                  height={24}
                  className="pointer-events-none"
                />
                <span className="font-bold text-sm">
                  {game.homeTeam.abbreviation}
                </span>
              </div>
            )}
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
        {game.period &&
          game.gameStatus !== "STATUS_SCHEDULED" &&
          game.gameStatus !== "STATUS_FINAL" && (
            <div className="text-center flex-1">
              {isOpen ? game.period : game.shortPeriod}{" "}
              {game.channel && "on " + game.channel}
            </div>
          )}
        {game.currentDownAndDistance && (
          <div className="text-center flex-1">
            {game.currentDownAndDistance}
          </div>
        )}
        {isOpen && game.lastPlay && (
          <div className="text-center flex-1">Last Play: {game.lastPlay}</div>
        )}
      </div>
      <div>
        {game.gameStatus === "STATUS_SCHEDULED" && <div>{game.date}</div>}
        {isOpen && game.headline && <div>{game.headline}</div>}
        {isOpen && game.channel && <div>{game.channel}</div>}
        {isOpen && <div>{game.stadiumName}</div>}
        {isOpen && <div>{game.location}</div>}
        {isOpen && (
          <Link
            href={game.espnLink}
            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
            target="_blank"
          >
            ESPN Game Page
          </Link>
        )}
      </div>
    </div>
  );
};

export default GameCard;
