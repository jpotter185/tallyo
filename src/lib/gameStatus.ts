const IN_PROGRESS_STATUSES = new Set([
  "STATUS_IN_PROGRESS",
  "STATUS_HALFTIME",
  "STATUS_END_PERIOD",
]);

const SCHEDULED_STATUS = "STATUS_SCHEDULED";
const FINAL_STATUS = "STATUS_FINAL";

export function isScheduledGame(status?: string): boolean {
  return status === SCHEDULED_STATUS;
}

export function isFinalGame(status?: string): boolean {
  return status === FINAL_STATUS;
}

export function isInProgressGame(status?: string): boolean {
  return !!status && IN_PROGRESS_STATUSES.has(status);
}

export function shouldShowGameScore(status?: string): boolean {
  return !isScheduledGame(status);
}

export function shouldPollGameStats(status?: string): boolean {
  return !isScheduledGame(status) && !isFinalGame(status);
}

export function shouldShowScheduledOrFinalDate(status?: string): boolean {
  return isScheduledGame(status) || isFinalGame(status);
}

export function shouldShowLiveGameDetails(status?: string): boolean {
  return !isScheduledGame(status) && !isFinalGame(status);
}

export function shouldShowGameChannel(status?: string): boolean {
  return !isFinalGame(status);
}

export function isLiveDashboardGame(game: Game): boolean {
  return !game.winner && !isScheduledGame(game.gameStatus);
}
