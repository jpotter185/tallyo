interface GameProps {
  game: Game;
}

const GameCard: React.FC<GameProps> = ({ game }) => {
  return (
    <div className="mb-4 shadow-md p-6 max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div>
        {game.awayTeam} {game.awayScore} @ {game.homeTeam} {game.homeScore}
      </div>
      <div>{game.channel}</div>
      <div>{game.period}</div>
      <div>{game.location}</div>
    </div>
  );
};

export default GameCard;
