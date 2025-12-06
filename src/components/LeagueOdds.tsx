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
              <div className="grid grid-cols-7 p-2">
                <div>Away Team</div>
                <div>Away Spread</div>
                <div>Away Odds</div>
                <div>Over Under</div>
                <div>Home Odds</div>
                <div>Home Spread</div>
                <div>Home Team</div>
              </div>
              {games.map((game) => {
                return (
                  <div key={game.id} className="grid grid-cols-7">
                    <div
                      className={`grid grid-cols-[auto_1fr_auto] items-center gap-1 p-1 `}
                    >
                      {game.awayTeam.logo && (
                        <Image
                          src={game.awayTeam.logo}
                          alt=""
                          width={24}
                          height={24}
                          className="pointer-events-none"
                        />
                      )}
                      <div className="flex items-center gap-1 font-bold text-sm">
                        <div>
                          {game.awayTeam.ranking
                            ? game.awayTeam.ranking + game.awayTeam.abbreviation
                            : game.awayTeam.abbreviation}
                        </div>
                        <div>{game.awayTeam.record}</div>
                      </div>
                    </div>
                    <div>{game.odds?.awayTeamSpread}</div>
                    <div>{game.odds?.awayMoneyline}</div>
                    <div>{game.odds?.overUnder}</div>
                    <div>{game.odds?.homeMoneyline}</div>
                    <div>{game.odds?.homeTeamSpread}</div>
                    <div
                      className={`grid grid-cols-[auto_1fr_auto] items-center gap-1 p-1 `}
                    >
                      {game.homeTeam.logo && (
                        <Image
                          src={game.homeTeam.logo}
                          alt=""
                          width={24}
                          height={24}
                          className="pointer-events-none"
                        />
                      )}
                      <div className="flex items-center gap-1 font-bold text-sm">
                        <div>
                          {game.homeTeam.ranking
                            ? game.homeTeam.ranking + game.homeTeam.abbreviation
                            : game.homeTeam.abbreviation}
                        </div>
                        <div>{game.homeTeam.record}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
