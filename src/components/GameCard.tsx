interface GameProps {
  game: Game;
}

const GameCard: React.FC<GameProps> = ({ game }) => {
  return (
    <div>
      <div>
        {game.awayTeam} {game.awayScore} @ {game.homeTeam} {game.homeScore}
      </div>
      <div>{game.location}</div>
      <div>{game.date}</div>
      <hr />
    </div>
  );
};

export default GameCard;
