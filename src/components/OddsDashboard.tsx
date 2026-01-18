import { fetcher } from "@/lib/api/fetcher";
import useSWR from "swr";
// import LeagueOdds from "./LeagueOdds";
import { useState } from "react";

const OddsDashboard: React.FC = () => {
  const [isCfbOpen, setIsCfbOpen] = useState(false);
  const [isNflOpen, setIsNflOpen] = useState(false);
  // const { data: cfbData, isLoading: isCfbLoading } = useSWR(
  //   `/api/games/current?league=cfb`,
  //   fetcher,
  //   {
  //     refreshInterval: 30000,
  //   }
  // );
  // const cfbGames: Game[] = cfbData || [];

  // const { data: nflData, isLoading: isNflLoading } = useSWR(
  //   `/api/games/current?league=nfl`,
  //   fetcher,
  //   {
  //     refreshInterval: 30000,
  //   }
  // );
  // const nflGames: Game[] = nflData || [];

  return (
    // <div>
    //   <LeagueOdds
    //     games={cfbGames}
    //     leagueName="CFB"
    //     isLoading={isCfbLoading}
    //     isLeagueOpen={isCfbOpen}
    //     setIsLeagueOpen={setIsCfbOpen}
    //   />
    //   <LeagueOdds
    //     games={nflGames}
    //     leagueName="NFL"
    //     isLoading={isNflLoading}
    //     isLeagueOpen={isNflOpen}
    //     setIsLeagueOpen={setIsNflOpen}
    //   />
    // </div>
    <div>Under construction...</div>
  );
};

export default OddsDashboard;
