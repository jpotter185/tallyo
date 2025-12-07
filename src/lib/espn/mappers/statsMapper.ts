export default function mapStats(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leaders: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scoringPlays: any,
): { statMap: Map<string, Stat>; scoringPlays: ScoringPlay[] } {
  const statMap: Map<string, Stat> = new Map<string, Stat>();
  if (!leaders && !scoringPlays) {
    return { statMap, scoringPlays: [] };
  }
  for (const team of leaders) {
    for (const teamStat of team.leaders) {
      const teamStatLeaders = teamStat.leaders;
      if (teamStatLeaders && teamStatLeaders.length > 0) {
        const stat: Stat = {
          name: teamStat?.name,
          displayName: teamStat?.displayName,
          shortDisplayName: teamStat?.shortDisplayName,
          abbreviation: team?.team.abbreviation,
          value: teamStat?.value,
          displayValue: teamStat?.leaders[0].displayValue,
          playerName: teamStat?.leaders[0].athlete.fullName,
          playerShortName: teamStat?.leaders[0].athlete.shortName,
          teamId: team?.team.id,
        };
        statMap.set(`${teamStat.name}-${team.team.id}`, stat);
      }
    }
  }
  const scoringPlaysArray: ScoringPlay[] = [];
  if (scoringPlays && scoringPlays.length > 0) {
    for (const play of scoringPlays) {
      const scoringPlay: ScoringPlay = {
        id: play?.id,
        teamId: play?.team?.id,
        teamName: play?.team?.abbreviation,
        displayText: play?.text,
        homeScore: play?.homeScore,
        awayScore: play?.awayScore,
        scoringType: play?.scoringType?.abbreviation,
        quarter: play?.period?.number,
        clock: play?.clock?.displayValue,
      };
      scoringPlaysArray.push(scoringPlay);
    }
  }

  return { statMap, scoringPlays: scoringPlaysArray };
}
