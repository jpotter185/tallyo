import { Game } from "@/types/api-contract";
import { dateFormatter } from "@/lib/format/dateFormatter";
import {
  isScheduledGame,
  shouldShowGameChannel,
  shouldShowGameScore,
  shouldShowScheduledOrFinalDate,
} from "@/lib/gameStatus";
import { getGameSides } from "@/lib/gameLayout";
import CompactTeamCard from "../TeamCard/CompactTeamCard";

interface GameCompactProps {
  game: Game;
}

const CompactGameCard: React.FC<GameCompactProps> = ({ game }) => {
  const { left, right } = getGameSides(game);

  return (
    <div>
      <CompactTeamCard
        team={left.team}
        score={left.score}
        winner={game.winner}
        possessionTeamId={game.possessionTeamId}
        showScore={shouldShowGameScore(game.gameStatus)}
      />
      <CompactTeamCard
        team={right.team}
        score={right.score}
        winner={game.winner}
        possessionTeamId={game.possessionTeamId}
        showScore={shouldShowGameScore(game.gameStatus)}
      />

      <div className="flex flex-col">
        {!isScheduledGame(game.gameStatus) && <div>{game.shortPeriod}</div>}

        {game.headline && <div>{game.headline}</div>}
        {shouldShowScheduledOrFinalDate(game.gameStatus) && (
          <div>{dateFormatter.format(new Date(game.isoDate))}</div>
        )}
        {shouldShowGameChannel(game.gameStatus) && <div>{game.channel}</div>}
      </div>
    </div>
  );
};

export default CompactGameCard;
