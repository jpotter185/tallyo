import Image from "next/image";
import { shouldShowLiveGameDetails } from "@/lib/gameStatus";

interface TeamCardProps {
  team: Team;
  score: string;
  winner?: string;
  possessionTeamId: string;
  timeouts?: number;
  league: string;
  gameStatus?: string;
  homeTeam: boolean;
  showScore: boolean;
  record: string;
  supportsLiveDetails: boolean;
}

const FullsizeTeamCard: React.FC<TeamCardProps> = ({
  team,
  record,
  score,
  winner,
  possessionTeamId,
  timeouts,
  league,
  gameStatus,
  homeTeam,
  showScore,
  supportsLiveDetails,
}) => {
  const hasPossession =
    supportsLiveDetails &&
    shouldShowLiveGameDetails(gameStatus) &&
    `${possessionTeamId}` === `${team.teamKey.teamId}`;

  return (
    <div
      className={
        !homeTeam
          ? "flex justify-between items-center gap-2" // inner-edge to the LEFT
          : "flex justify-between items-center gap-2 flex-row-reverse" // inner-edge to the RIGHT
      }
    >
      {/* Team info (always on outer edge) */}
      <div className="flex flex-col items-center text-center">
        {team.logo && <Image src={team.logo} alt="" width={24} height={24} />}

        <div className="text-nowrap">
          {team.ranking
            ? `${team.ranking}${team.abbreviation}`
            : team.abbreviation}
        </div>

        <div className="text-xs">{record}</div>
        {timeouts !== undefined && league === "NFL" && (
          <div className="flex items-center gap-1 mt-1">
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

      {/* INNER EDGE SCORE + POSSESSION */}
      <div className="flex items-center gap-1 p-2">
        {/* possession (left of score for home, right for away due to flex reversing) */}

        {hasPossession && (
          <svg width="18" height="18" viewBox="0 0 120 50">
            <polygon points="10,25 60,5 110,25 60,45" fill="currentColor" />
          </svg>
        )}
        {/* score */}
        <span
          className={`p-2 ${
            winner === team.teamKey.teamId.toString()
              ? "font-extrabold"
              : winner
                ? "font-thin"
                : ""
          }`}
        >
          {showScore ? score : ""}
        </span>
      </div>
    </div>
  );
};

export default FullsizeTeamCard;
