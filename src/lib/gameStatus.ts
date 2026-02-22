const IN_PROGRESS_STATUSES = new Set([
  "STATUS_IN_PROGRESS",
  "STATUS_HALFTIME",
  "STATUS_END_PERIOD",
]);

const SCHEDULED_STATUS = "STATUS_SCHEDULED";
const FINAL_STATUS = "STATUS_FINAL";
const MAX_RECENTLY_STARTED_GAME_AGE_MS = 6 * 60 * 60 * 1000;

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

function isRecentlyStartedGame(isoDate?: string): boolean {
  if (!isoDate) {
    return false;
  }
  const startTime = new Date(isoDate).getTime();
  if (Number.isNaN(startTime)) {
    return false;
  }
  const now = Date.now();
  return (
    now >= startTime && now - startTime <= MAX_RECENTLY_STARTED_GAME_AGE_MS
  );
}

export function isLiveDashboardGame(game: Game): boolean {
  if (isFinalGame(game.gameStatus) || !!game.winner || game.final === true) {
    return false;
  }

  if (isInProgressGame(game.gameStatus)) {
    return true;
  }

  if (isScheduledGame(game.gameStatus)) {
    return isRecentlyStartedGame(game.isoDate);
  }

  return true;
}
