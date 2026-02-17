import Link from "next/link";
import FullsizeTeamCard from "../TeamCard/FullsizeTeamCard";
import CollapsableSection from "../CollapsableSection";
import { dateFormatter } from "@/lib/espn/enums/dateFormatter";
import {
  isScheduledGame,
  shouldShowGameChannel,
  shouldShowGameScore,
  shouldShowLiveGameDetails,
  shouldShowScheduledOrFinalDate,
} from "@/lib/gameStatus";
import { getGameSides } from "@/lib/gameLayout";
interface GameProps {
  game: Game;
  stats: Map<string, Stat> | undefined;
  scoringPlays: ScoringPlay[] | undefined;
  openScoringPlaysForGame: () => void;
  isScoringPlaysOpen: boolean;
  openStatsForGame: () => void;
  isStatsOpen: boolean;
  openTeamStatsForGame: () => void;
  isTeamStatsOpen: boolean;
  statsToDisplay: Map<string, string>;
}

const FullSizeGameCard: React.FC<GameProps> = ({
  game,
  stats,
  scoringPlays,
  openScoringPlaysForGame,
  isScoringPlaysOpen,
  openStatsForGame,
  isStatsOpen,
  openTeamStatsForGame,
  isTeamStatsOpen,
  statsToDisplay,
}) => {
  const { left, right } = getGameSides(game);
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

  const hasTeamStats =
    !!game.stats &&
    Array.from(statsToDisplay.keys()).some(
      (stat) =>
        game.stats.homeStats?.[stat] != null ||
        game.stats.awayStats?.[stat] != null,
    );

  return (
    <div>
      <div className="grid grid-cols-3 place-items-center items-center justify-center p-2">
        {/* Left-side team info */}
        <FullsizeTeamCard
          team={left.team}
          score={left.score}
          possessionTeamId={game.possessionTeamId}
          league={game.league}
          gameStatus={game.gameStatus}
          homeTeam={false}
          showScore={shouldShowGameScore(game.gameStatus)}
          record={left.record}
          timeouts={left.timeouts}
        />

        {/* Game info */}
        <div className="flex flex-col whitespace-nowrap place-items-center items-center justify-center">
          {!isScheduledGame(game.gameStatus) && <div>{game.shortPeriod}</div>}
          {shouldShowLiveGameDetails(game.gameStatus) && (
            <div className="text-xs">{game.down}</div>
          )}
          {shouldShowLiveGameDetails(game.gameStatus) && (
            <div className="text-xs">{game.ballLocation}</div>
          )}
          {shouldShowGameChannel(game.gameStatus) && (
            <div className="text-xs">{game.channel}</div>
          )}
        </div>
        {/* Right-side team info */}
        <FullsizeTeamCard
          team={right.team}
          score={right.score}
          possessionTeamId={game.possessionTeamId}
          league={game.league}
          gameStatus={game.gameStatus}
          homeTeam={true}
          showScore={shouldShowGameScore(game.gameStatus)}
          record={right.record}
          timeouts={right.timeouts}
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
                  {left.team.abbreviation}{" "}
                  {left.statSide === "homeStats"
                    ? play.homeScore
                    : play.awayScore}{" "}
                  -{" "}
                  {right.statSide === "homeStats"
                    ? play.homeScore
                    : play.awayScore}{" "}
                  {right.team.abbreviation}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {stats && stats.size > 0 && (
        <CollapsableSection
          title={`Player Stats`}
          isOpen={isStatsOpen}
          onToggle={() => openStatsForGame()}
        />
      )}
      {isStatsOpen && stats && (
        <div className="border rounded overflow-hidden divide-y">
          <div className="grid grid-cols-3 text-center divide-x font-semibold">
            <div>{left.team.abbreviation}</div>
            <div>Stat</div>
            <div>{right.team.abbreviation}</div>
          </div>
          {Array.from(stats.keys()).map((stat) => {
            const statName = stat.split("-")[0];
            if (!statName || gameStatNameTracker.has(statName)) {
              return;
            } else {
              gameStatNameTracker.add(statName);
              const leftStat: Stat | undefined = stats.get(
                `${statName}-${left.team.teamKey.teamId}`,
              );
              const rightStat: Stat | undefined = stats.get(
                `${statName}-${right.team.teamKey.teamId}`,
              );
              const safeLeftStat = leftStat ?? defaultStat;
              const safeRightStat = rightStat ?? defaultStat;
              if (safeLeftStat.name === "" && safeRightStat.name === "") {
                return;
              }

              return (
                <div
                  key={statName}
                  className="grid grid-cols-3 text-center divide-x"
                >
                  <div>
                    <div>{safeLeftStat.playerShortName}</div>
                    <div>{safeLeftStat.displayValue}</div>
                  </div>
                  <div>
                    {safeLeftStat.displayName || safeRightStat.displayName}
                  </div>
                  <div>
                    <div>{safeRightStat.playerShortName}</div>
                    <div>{safeRightStat.displayValue}</div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}
      {hasTeamStats &&
        game.stats &&
        (game.stats.homeStats || game.stats.awayStats) && (
          <CollapsableSection
            title={`Team Stats`}
            isOpen={isTeamStatsOpen}
            onToggle={() => openTeamStatsForGame()}
          />
        )}
      {hasTeamStats && isTeamStatsOpen && (
        <div className="border rounded overflow-hidden divide-y">
          <div className="grid grid-cols-3 text-center divide-x font-semibold">
            <div>{left.team.abbreviation}</div>
            <div>Team Stats</div>
            <div>{right.team.abbreviation}</div>
          </div>
          {Array.from(statsToDisplay.entries()).map((stat) => {
            return (
              <div
                className="grid grid-cols-3 text-center divide-x"
                key={stat + game.id}
              >
                <div>{game.stats[left.statSide][stat[0]]}</div>
                <div>{stat[1]}</div>
                <div>{game.stats[right.statSide][stat[0]]}</div>
              </div>
            );
          })}
        </div>
      )}
      <br />
      <div className="flex flex-col place-items-center items-center justify-center">
        {game.headline && <div>{game.headline}</div>}
        <div>{game.gameOdd?.spreadText}</div>
        {shouldShowScheduledOrFinalDate(game.gameStatus) && (
          <div>{dateFormatter.format(new Date(game.isoDate))}</div>
        )}
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
