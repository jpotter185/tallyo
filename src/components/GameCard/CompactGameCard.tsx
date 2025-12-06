import { dateFormatter } from "@/lib/espn/transformers";
import CompactTeamCard from "../TeamCard/CompactTeamCard";

interface GameCompactProps {
  game: Game;
}

const CompactGameCard: React.FC<GameCompactProps> = ({ game }) => {
  return (
    <div>
      <CompactTeamCard
        team={game.awayTeam}
        score={game.awayScore}
        winner={game.winner}
        possessionTeamId={game.possessionTeamId}
      />
      <CompactTeamCard
        team={game.homeTeam}
        score={game.homeScore}
        winner={game.winner}
        possessionTeamId={game.possessionTeamId}
      />

      <div className="flex flex-col">
        {game.gameStatus !== "STATUS_SCHEDULED" && (
          <div>{game.shortPeriod}</div>
        )}
        {game.gameStatus === "STATUS_SCHEDULED" && (
          <div>{dateFormatter.format(new Date(game.isoDate))}</div>
        )}
        {game.shortPeriod !== "Final" && <div>{game.channel}</div>}
        {game.headline && <div>{game.headline}</div>}
      </div>
    </div>
  );
};

export default CompactGameCard;
