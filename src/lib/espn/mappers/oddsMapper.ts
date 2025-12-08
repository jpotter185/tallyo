export default function getCleanedOdds(
  eventId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  oddsJson: any,
  game?: Game,
): Odds | undefined {
  const oddsJsonEntry = oddsJson.items[0];
  if (!oddsJsonEntry) return undefined;
  const cleanedOdds: Odds = {
    eventId: eventId,
    spreadText: oddsJsonEntry.details,
    awayTeamSpread: String(
      oddsJsonEntry.awayTeamOdds?.current?.pointSpread?.american,
    ),
    homeTeamSpread: String(
      oddsJsonEntry.homeTeamOdds?.current?.pointSpread?.american,
    ),
    overUnder: String(oddsJsonEntry.overUnder),
    overOdds: String(oddsJsonEntry.overOdds),
    underOdds: String(oddsJsonEntry.underOdds),
    awayMoneyline:
      String(oddsJsonEntry.awayTeamOdds?.moneyLine).indexOf("-") > -1
        ? String(oddsJsonEntry.awayTeamOdds?.moneyLine)
        : "+" + String(oddsJsonEntry.awayTeamOdds?.moneyLine),
    homeMoneyline:
      String(oddsJsonEntry.homeTeamOdds?.moneyLine).indexOf("-") > -1
        ? String(oddsJsonEntry.homeTeamOdds?.moneyLine)
        : "+" + String(oddsJsonEntry.homeTeamOdds?.moneyLine),
    homeFavorite: oddsJsonEntry.homeTeamOdds?.favorite,
    awayFavorite: oddsJsonEntry.awayTeamOdds?.favorite,
  };
  if (game && game.final && game.homeScore && game.awayScore) {
    const total = parseInt(game.homeScore) + parseInt(game.awayScore);
    cleanedOdds.total = String(total);
    const ovrUnderFloat = parseFloat(cleanedOdds.overUnder);
    if (total > ovrUnderFloat) {
      cleanedOdds.over = true;
      cleanedOdds.under = false;
      cleanedOdds.push = false;
    } else if (total < ovrUnderFloat) {
      cleanedOdds.over = false;
      cleanedOdds.under = true;
      cleanedOdds.push = false;
    } else {
      cleanedOdds.over = false;
      cleanedOdds.under = false;
      cleanedOdds.push = true;
    }
    const diff = parseInt(game.homeScore) - parseInt(game.awayScore);
    if (diff > 0) {
      //home team wins
      if (cleanedOdds.homeFavorite) {
        //home team favored
        if (diff > Math.abs(parseFloat(cleanedOdds.homeTeamSpread))) {
          cleanedOdds.homeCover = true;
          cleanedOdds.awayCover = false;
        } else {
          cleanedOdds.homeCover = false;
          cleanedOdds.awayCover = true;
        }
      } else {
        //away team favored
        cleanedOdds.homeCover = true;
        cleanedOdds.awayCover = false;
      }
    } else {
      //away team wins
      if (cleanedOdds.awayFavorite) {
        if (Math.abs(diff) > Math.abs(parseFloat(cleanedOdds.awayTeamSpread))) {
          cleanedOdds.awayCover = true;
          cleanedOdds.homeCover = false;
        } else {
          cleanedOdds.homeCover = true;
          cleanedOdds.awayCover = false;
        }
      } else {
        cleanedOdds.awayCover = true;
        cleanedOdds.homeCover = false;
      }
    }
  }

  return cleanedOdds;
}
