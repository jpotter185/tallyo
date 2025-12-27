import Link from "next/link";
import FullsizeTeamCard from "../TeamCard/FullsizeTeamCard";
import CollapsableSection from "../CollapsableSection";
import { dateFormatter } from "@/lib/espn/enums/dateFormatter";
interface GameProps {
  game: Game;
  stats: Map<string, Stat> | undefined;
  scoringPlays: ScoringPlay[] | undefined;
  openScoringPlaysForGame: () => void;
  isScoringPlaysOpen: boolean;
  openStatsForGame: () => void;
  isStatsOpen: boolean;
}

const FullSizeGameCard: React.FC<GameProps> = ({
  game,
  stats,
  scoringPlays,
  openScoringPlaysForGame,
  isScoringPlaysOpen,
  openStatsForGame,
  isStatsOpen,
}) => {
  const gameStatNameTracker = new Set<string>();
  const defaultStat: Stat = {
    name: "",
    displayName: "",
    shortDisplayName: "",
    abbreviation: "",
    value: "",
    displayValue: "",
    playerName: "",
    playerShortName: "",
    teamId: "",
  };
  return (
    <div>
      <div className="grid grid-cols-3 place-items-center items-center justify-center p-2">
        {/* Away team info */}
        <FullsizeTeamCard
          team={game.awayTeam}
          score={game.awayScore}
          possessionTeamId={game.possessionTeamId}
          league={game.league}
          homeTeam={false}
          showScore={game.gameStatus !== "STATUS_SCHEDULED"}
          record={game.awayRecordAtTimeOfGame}
        />

        {/* Game info */}
        <div className="flex flex-col whitespace-nowrap place-items-center items-center justify-center">
          {game.gameStatus !== "STATUS_SCHEDULED" && (
            <div>{game.shortPeriod}</div>
          )}
          {game.shortPeriod !== "Final" &&
            game.gameStatus !== "STATUS_SCHEDULED" && (
              <div className="text-xs">{game.down}</div>
            )}
          {game.shortPeriod !== "Final" &&
            game.gameStatus !== "STATUS_SCHEDULED" && (
              <div className="text-xs">{game.ballLocation}</div>
            )}
          {game.shortPeriod !== "Final" && (
            <div className="text-xs">{game.channel}</div>
          )}
        </div>
        {/* Home team score */}
        <FullsizeTeamCard
          team={game.homeTeam}
          score={game.homeScore}
          possessionTeamId={game.possessionTeamId}
          league={game.league}
          homeTeam={true}
          showScore={game.gameStatus !== "STATUS_SCHEDULED"}
          record={game.homeRecordAtTimeOfGame}
        />
      </div>
      {game.lastPlay && (
        <div className="p-2 flex flex-col place-items-center items-center justify-center">
          Last Play:
          <div>{game.lastPlay}</div>
        </div>
      )}
      {game.lastPlay && game.awayWinPercentage && game.homeWinPercentage && (
        <div>
          {game.awayWinPercentage > game.homeWinPercentage ? (
            <div className="p-2 flex flex-col place-items-center items-center justify-center">
              {game.awayTeam.abbreviation} chance to win:
              <div>
                {(Number(game.awayWinPercentage) * 100).toFixed(1) + "%"}
              </div>
            </div>
          ) : (
            <div className="p-2 flex flex-col place-items-center items-center justify-center">
              {game.homeTeam.abbreviation} chance to win:
              <div>
                {(Number(game.homeWinPercentage) * 100).toFixed(1) + "%"}
              </div>
            </div>
          )}
        </div>
      )}
      {scoringPlays && scoringPlays.length > 0 && (
        <CollapsableSection
          title={`Scoring Plays`}
          isOpen={isScoringPlaysOpen}
          onToggle={() => openScoringPlaysForGame()}
        />
      )}
      {isScoringPlaysOpen && (
        <div className="border rounded overflow-hidden divide-y">
          {scoringPlays?.map((play) => {
            return (
              <div className="p-1" key={play.id}>
                <div>
                  {play.quarter}Q - {play.clock}
                </div>
                <div>
                  {play.teamName} {play.scoringType} - {play.displayText}
                </div>
                <div>
                  {game.awayTeam.abbreviation} {play.awayScore} -{" "}
                  {play.homeScore} {game.homeTeam.abbreviation}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {stats && stats.size > 0 && (
        <CollapsableSection
          title={`Stats`}
          isOpen={isStatsOpen}
          onToggle={() => openStatsForGame()}
        />
      )}
      {isStatsOpen && stats && (
        <div className="border rounded overflow-hidden divide-y">
          <div className="grid grid-cols-3 text-center divide-x font-semibold">
            <div>{game.awayTeam.abbreviation}</div>
            <div>Stat</div>
            <div>{game.homeTeam.abbreviation}</div>
          </div>
          {Array.from(stats.keys()).map((stat) => {
            const statName = stat.split("-")[0];
            if (!statName || gameStatNameTracker.has(statName)) {
              return;
            } else {
              gameStatNameTracker.add(statName);
              let homeStat: Stat | undefined = stats.get(
                `${statName}-${game.homeTeam.teamKey.teamId}`
              );
              if (!homeStat) {
                homeStat = defaultStat;
              }
              let awayStat: Stat | undefined = stats.get(
                `${statName}-${game.awayTeam.teamKey.teamId}`
              );
              if (!awayStat) {
                awayStat = defaultStat;
              }
              if (awayStat.name === "" && homeStat.name === "") {
                return;
              }
              return (
                <div
                  key={statName}
                  className="grid grid-cols-3 text-center divide-x"
                >
                  <div>
                    <div>{awayStat.playerShortName}</div>
                    <div>{awayStat.displayValue}</div>
                  </div>
                  <div>{awayStat.displayName || homeStat.displayName}</div>
                  <div>
                    <div>{homeStat.playerShortName}</div>
                    <div>{homeStat.displayValue}</div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}
      <div className="flex flex-col place-items-center items-center justify-center">
        <div>{game.odds?.spreadText}</div>
        {game.gameStatus === "STATUS_SCHEDULED" ||
          (game.gameStatus === "STATUS_FINAL" && (
            <div>{dateFormatter.format(new Date(game.isoDate))}</div>
          ))}
        <div>{game.stadiumName}</div>
        <div>{game.location}</div>
        <div>
          <Link
            href={game.espnLink}
            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
            target="_blank"
          >
            ESPN
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FullSizeGameCard;
