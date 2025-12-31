import Image from "next/image";

interface TeamCardProps {
  team: Team;
  score: string;
  winner?: string;
  possessionTeamId: string;
  showScore: boolean;
}

const CompactTeamCard: React.FC<TeamCardProps> = ({
  team,
  score,
  winner,
  possessionTeamId,
  showScore,
}) => {
  return (
    <div
      className={`grid grid-cols-[auto_1fr_auto] items-center gap-1 p-1 ${
        winner && winner.toString() === team.teamKey.teamId.toString()
          ? "border-2 border-sky-50 dark:border-neutral-800"
          : ""
      }`}
    >
      {team.logo && (
        <Image
          src={team.logo}
          alt=""
          width={24}
          height={24}
          className="pointer-events-none"
        />
      )}
      <div className="flex items-center gap-1 font-bold text-sm">
        <div>
          {team.ranking ? team.ranking + team.abbreviation : team.abbreviation}
        </div>
        {possessionTeamId === team.teamKey.teamId.toString() && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 120 50"
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block text-base"
          >
            <polygon points="10,25 60,5 110,25 60,45" fill="currentColor" />
          </svg>
        )}
      </div>
      <div>{showScore ? score : ""}</div>
    </div>
  );
};

export default CompactTeamCard;
