import Link from "next/link";
import { Game, ScoringPlay, StatLeader } from "@/types/api-contract";
import FullsizeTeamCard from "../TeamCard/FullsizeTeamCard";
import CollapsableSection from "../CollapsableSection";
import { dateFormatter } from "@/lib/format/dateFormatter";
import {
  isScheduledGame,
  shouldShowGameChannel,
  shouldShowGameScore,
  shouldShowLiveGameDetails,
  shouldShowScheduledOrFinalDate,
} from "@/lib/gameStatus";
import { getGameSides } from "@/lib/gameLayout";
import {
  statsProfileForLeague,
  supportsLiveDetailsForLeague,
  supportsOddsForLeague,
} from "@/lib/leagues/leagueConfig";

interface GameProps {
  game: Game;
  leaders: Map<string, StatLeader>;
  scoringPlays: ScoringPlay[];
  isScoringPlaysOpen: boolean;
  toggleScoringPlays: () => void;
  isStatsOpen: boolean;
  toggleStats: () => void;
  isTeamStatsOpen: boolean;
  toggleTeamStats: () => void;
  statsToDisplay: Map<string, string>;
}

function inningLabel(period?: number | null): string {
  if (period == null) {
    return "";
  }
  const suffix =
    period % 10 === 1 && period % 100 !== 11
      ? "st"
      : period % 10 === 2 && period % 100 !== 12
        ? "nd"
        : period % 10 === 3 && period % 100 !== 13
          ? "rd"
          : "th";
  return `${period}${suffix} Inning`;
}

const FullSizeGameCard: React.FC<GameProps> = ({
  game,
  leaders,
  scoringPlays,
  isScoringPlaysOpen,
  toggleScoringPlays,
  isStatsOpen,
  toggleStats,
  isTeamStatsOpen,
  toggleTeamStats,
  statsToDisplay,
}) => {
  const { left, right } = getGameSides(game);
  const isBaseball = statsProfileForLeague(game.league) === "baseball";
  const leagueSupportsLiveDetails = supportsLiveDetailsForLeague(game.league);
  const canShowLiveDetails =
    leagueSupportsLiveDetails && shouldShowLiveGameDetails(game.gameStatus);
  const canShowOdds =
    supportsOddsForLeague(game.league) && !!game.gameOdd?.spreadText;
  const renderedStatNames = new Set<string>();

  const hasTeamStats =
    !!game.stats &&
    Array.from(statsToDisplay.keys()).some(
      (stat) =>
        game.stats?.homeStats?.[stat] != null ||
        game.stats?.awayStats?.[stat] != null,
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
          supportsLiveDetails={leagueSupportsLiveDetails}
        />

        {/* Game info */}
        <div className="flex flex-col whitespace-nowrap place-items-center items-center justify-center">
          {!isScheduledGame(game.gameStatus) && <div>{game.shortPeriod}</div>}
          {canShowLiveDetails && <div className="text-xs">{game.down}</div>}
          {canShowLiveDetails && (
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
          supportsLiveDetails={leagueSupportsLiveDetails}
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
      {scoringPlays.length > 0 && (
        <CollapsableSection
          title={`Scoring Plays`}
          isOpen={isScoringPlaysOpen}
          onToggle={toggleScoringPlays}
        />
      )}
      {isScoringPlaysOpen && (
        <div className="border rounded overflow-hidden divide-y">
          {scoringPlays.map((play) => {
            const hasRunningScore =
              play.homeScore != null && play.awayScore != null;
            return (
              <div className="p-1" key={play.id}>
                <div>
                  {/* Baseball plays carry the inning as period and no clock */}
                  {isBaseball
                    ? inningLabel(play.period)
                    : `${play.period}Q - ${play.clock}`}
                </div>
                <div>
                  {/* Baseball's generic "Play Result" type adds no signal */}
                  {isBaseball && play.scoringType === "Play Result"
                    ? `${play.teamName} - ${play.displayText}`
                    : `${play.teamName} ${play.scoringType} - ${play.displayText}`}
                </div>
                {hasRunningScore && (
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
                )}
              </div>
            );
          })}
        </div>
      )}
      {leaders.size > 0 && (
        <CollapsableSection
          title={`Player Stats`}
          isOpen={isStatsOpen}
          onToggle={toggleStats}
        />
      )}
      {isStatsOpen && (
        <div className="border rounded overflow-hidden divide-y">
          <div className="grid grid-cols-3 text-center divide-x font-semibold">
            <div>{left.team.abbreviation}</div>
            <div>Stat</div>
            <div>{right.team.abbreviation}</div>
          </div>
          {Array.from(leaders.values()).map((leader) => {
            const statName = leader.name;
            if (!statName || renderedStatNames.has(statName)) {
              return null;
            }
            renderedStatNames.add(statName);
            const leftLeader = leaders.get(
              `${statName}-${left.team.teamKey.teamId}`,
            );
            const rightLeader = leaders.get(
              `${statName}-${right.team.teamKey.teamId}`,
            );
            if (!leftLeader && !rightLeader) {
              return null;
            }

            return (
              <div
                key={statName}
                className="grid grid-cols-3 text-center divide-x"
              >
                <div>
                  <div>{leftLeader?.playerShortName}</div>
                  <div>{leftLeader?.displayValue}</div>
                </div>
                <div>{leftLeader?.displayName || rightLeader?.displayName}</div>
                <div>
                  <div>{rightLeader?.playerShortName}</div>
                  <div>{rightLeader?.displayValue}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {hasTeamStats && (
        <CollapsableSection
          title={`Team Stats`}
          isOpen={isTeamStatsOpen}
          onToggle={toggleTeamStats}
        />
      )}
      {hasTeamStats && isTeamStatsOpen && (
        <div className="border rounded overflow-hidden divide-y">
          <div className="grid grid-cols-3 text-center divide-x font-semibold">
            <div>{left.team.abbreviation}</div>
            <div>Team Stats</div>
            <div>{right.team.abbreviation}</div>
          </div>
          {Array.from(statsToDisplay.entries()).map(([statKey, statLabel]) => {
            return (
              <div
                className="grid grid-cols-3 text-center divide-x"
                key={statKey + game.id}
              >
                <div>{game.stats?.[left.statSide]?.[statKey]}</div>
                <div>{statLabel}</div>
                <div>{game.stats?.[right.statSide]?.[statKey]}</div>
              </div>
            );
          })}
        </div>
      )}
      <br />
      <div className="flex flex-col place-items-center items-center justify-center">
        {game.headline && <div>{game.headline}</div>}
        {canShowOdds && <div>{game.gameOdd?.spreadText}</div>}
        {shouldShowScheduledOrFinalDate(game.gameStatus) && (
          <div>{dateFormatter.format(new Date(game.isoDate))}</div>
        )}
        <div>{game.stadiumName}</div>
        <div>{game.location}</div>
        {game.espnLink && (
          <div>
            <Link
              href={game.espnLink}
              className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
            >
              ESPN
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FullSizeGameCard;
