import Image from "next/image";

interface GameCompactProps {
  game: Game;
}

const CompactGameCard: React.FC<GameCompactProps> = ({ game }) => {
  return (
    <div>
      <div
        className={`grid grid-cols-[auto_1fr_auto] items-center gap-2 p-1 ${
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
        <div className="font-bold text-sm">
          {game.awayTeam.abbreviation &&
          game.possessionTeamId === game.awayTeam.id
            ? game.awayTeam.abbreviation + " ▶"
            : game.awayTeam.abbreviation}
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
        <div className="font-bold text-sm">
          <span className="font-bold text-sm">
            {game.homeTeam.abbreviation &&
            game.possessionTeamId === game.homeTeam.id
              ? game.homeTeam.abbreviation + " ▶"
              : game.homeTeam.abbreviation}
          </span>
        </div>
        <div>{game.homeScore}</div>
      </div>
      <div>
        {game.shortPeriod} {game.shortPeriod === "Final" ? "" : game.channel}
      </div>
    </div>
  );
};

export default CompactGameCard;
