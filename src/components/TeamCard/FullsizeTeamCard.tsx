import Image from "next/image";

interface TeamCardProps {
  team: Team;
  score: string;
  winner?: string;
  possessionTeamId: string;
  timeouts?: number;
  league: string;
  shortPeriod?: string;
  homeTeam: boolean;
}
const FullsizeTeamCard: React.FC<TeamCardProps> = ({
  team,
  score,
  winner,
  possessionTeamId,
  timeouts,
  league,
  shortPeriod,
  homeTeam,
}) => {
  return (
    <div className="grid grid-cols-2 place-items-center items-center justify-center p-2">
      {homeTeam && <div>{score}</div>}
      {homeTeam && shortPeriod !== "Final" && possessionTeamId === team.id && (
        <svg
          width="20"
          height="20"
          viewBox="0 0 120 50"
          xmlns="http://www.w3.org/2000/svg"
          className="inline-block px-1 text-base"
        >
          <polygon points="10,25 60,5 110,25 60,45" fill="currentColor" />
        </svg>
      )}
      <div className="flex flex-col">
        {team.logo && (
          <Image
            src={team.logo}
            alt=""
            width={24}
            height={24}
            className="pointer-events-none"
          />
        )}
        <div className="text-nowrap">
          {team.ranking ? team.ranking + team.abbreviation : team.abbreviation}
        </div>
        <div className="text-xs">{team.record}</div>
        {timeouts && league === "nfl" && (
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-1 h-1 rounded-full ${
                  i < timeouts ? "bg-current" : "border border-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
      <div
        className={` ${
          winner && winner === team.id
            ? "font-extrabold"
            : winner
              ? "font-thin"
              : ""
        }`}
      >
        {!homeTeam && <div>{score}</div>}
        {!homeTeam &&
          shortPeriod !== "Final" &&
          possessionTeamId === team.id && (
            <svg
              width="20"
              height="20"
              viewBox="0 0 120 50"
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block px-1 text-base"
            >
              <polygon points="10,25 60,5 110,25 60,45" fill="currentColor" />
            </svg>
          )}
      </div>
    </div>
  );
};

export default FullsizeTeamCard;
