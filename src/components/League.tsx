import GameCard from "./GameCard";

interface LeagueProps {
  games: Game[];
  leagueName: string;
}

const League: React.FC<LeagueProps> = ({ leagueName, games }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{leagueName} Games</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
};

export default League;
