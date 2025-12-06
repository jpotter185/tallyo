import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
interface LeagueOddsProps {
  leagueName: string;
  games: Game[];
  isLoading: boolean;
  isLeagueOpen: boolean;
  setIsLeagueOpen: Dispatch<SetStateAction<boolean>>;
}

const LeagueOdds: React.FC<LeagueOddsProps> = ({
  leagueName,
  games,
  isLeagueOpen,
  setIsLeagueOpen,
  isLoading,
}) => {
  return (
    <div>
      <button
        className="flex w-full items-center justify-between p-2 text-2xl font-bold mb-4"
        onClick={() => setIsLeagueOpen(!isLeagueOpen)}
      >
        <span>{leagueName} Odds</span>
        <ChevronDown
          textAnchor="end"
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
            isLeagueOpen ? "rotate-180" : ""
          }`}
        ></ChevronDown>
      </button>
      {isLeagueOpen ? (
        <div>
          {isLoading ? (
            <div>Loading {leagueName} games...</div>
          ) : (
            <div>
              {games.map((game) => (
                <div
                  key={game.id}
                  className="border border-gray-300 dark:border-gray-600 rounded-xl shadow-md bg-neutral-300 dark:bg-neutral-500 p-4 mb-4"
                >
                  <div className="grid grid-cols-3 items-center">
                    <div className="flex flex-col items-start gap-2">
                      <div className="flex items-center gap-2">
                        <Image
                          src={game.awayTeam.logo}
                          alt=""
                          width={32}
                          height={32}
                          className="rounded-md"
                        />
                        <div>
                          <div className="font-semibold">
                            {game.awayTeam.ranking
                              ? `${game.awayTeam.ranking} ${game.awayTeam.abbreviation}`
                              : game.awayTeam.abbreviation}
                          </div>
                          <div className="text-xs">{game.awayTeam.record}</div>
                        </div>
                      </div>

                      <div className="text-sm">
                        <span className="text-xs block">Moneyline</span>
                        <span className="font-semibold">
                          {game.odds?.awayMoneyline}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-xs block">Spread</span>
                        <span className="font-semibold">
                          {game.odds?.awayTeamSpread}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-3 px-4">
                      <div className="text-center">
                        <div className="font-semibold">
                          O/U{game.odds?.overUnder}
                        </div>
                        <div className="text-xs">Total Points</div>
                        <br />
                        <div className="text-xs">{game.date}</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="font-semibold">
                            {game.homeTeam.ranking
                              ? `${game.homeTeam.ranking} ${game.homeTeam.abbreviation}`
                              : game.homeTeam.abbreviation}
                          </div>
                          <div className="text-xs">{game.homeTeam.record}</div>
                        </div>

                        <Image
                          src={game.homeTeam.logo}
                          alt=""
                          width={32}
                          height={32}
                          className="rounded-md"
                        />
                      </div>

                      <div className="text-sm text-right">
                        <span className="text-xs block">Moneyline</span>
                        <span className="font-semibold">
                          {game.odds?.homeMoneyline}
                        </span>
                      </div>
                      <div className="text-sm text-right">
                        <span className="text-xs block">Spread</span>
                        <span className="font-semibold">
                          {game.odds?.homeTeamSpread}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default LeagueOdds;
