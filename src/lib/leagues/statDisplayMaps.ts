export const footballStatsToDisplay = new Map([
  ["possessionTime", "Possession Time"],
  ["totalDrives", "Total Drives"],
  ["totalYards", "Total Yards"],
  ["netPassingYards", "Passing Yards"],
  ["yardsPerPass", "Yards Per Pass"],
  ["rushingYards", "Total Rushing Yards"],
  ["yardsPerRushAttempt", "Yards Per Rush"],
  ["turnovers", "Turnovers"],
  ["firstDowns", "First Downs"],
  ["firstDownsPassing", "Passing First Downs"],
  ["firstDownsRushing", "Rushing First Downs"],
  ["thirdDownEff", "Third Down Efficiency"],
  ["fourthDownEff", "Fourth Down Efficiency"],
  ["totalPenaltiesYards", "Penalties"],
]);

export const hockeyStatsToDisplay = new Map([
  ["shotsTotal", "Total Shots"],
  ["faceoffPercent", "Faceoff Percentage"],
  ["faceoffsWon", "Faceoffs Won"],
  ["penalties", "Penalties"],
  ["powerPlayPct", "Power Play Percentage"],
  ["powerPlayOpportunities", "Power Play Opportunities"],
  ["powerPlayGoals", "Power Play Goals"],
  ["takeaways", "Takeaways"],
  ["giveaways", "Giveaways"],
  ["hits", "Hits"],
  ["blockedShots", "Blocked Shots"],
  ["shortHandedGoals", "Short Handed Goals"],
]);

// Baseball team stats arrive flattened from grouped box scores; keys are
// "<group>.<statName>" (see EspnBoxScoreMapper in the backend).
export const baseballStatsToDisplay = new Map([
  ["batting.runs", "Runs"],
  ["batting.hits", "Hits"],
  ["fielding.errors", "Errors"],
  ["batting.homeRuns", "Home Runs"],
  ["batting.RBIs", "RBIs"],
  ["batting.doubles", "Doubles"],
  ["batting.triples", "Triples"],
  ["batting.stolenBases", "Stolen Bases"],
  ["batting.walks", "Walks"],
  ["batting.strikeouts", "Strikeouts"],
  ["batting.runnersLeftOnBase", "Left On Base"],
  ["batting.avg", "Batting Average"],
  ["pitching.pitches", "Pitches Thrown"],
]);

export const soccerStatsToDisplay = new Map([
  ["totalShots", "Total Shots"],
  ["shotsOnTarget", "Shots On Target"],
  ["possessionPct", "Possession"],
  ["foulsCommitted", "Fouls"],
  ["yellowCards", "Yellow Cards"],
  ["redCards", "Red Cards"],
  ["wonCorners", "Corners"],
  ["offsides", "Offsides"],
  ["saves", "Saves"],
]);
