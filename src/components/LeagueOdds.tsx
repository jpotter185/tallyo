// import Image from "next/image";
// import { Dispatch, SetStateAction } from "react";
// import CollapsableSection from "./CollapsableSection";
// import { dateFormatter } from "@/lib/espn/enums/dateFormatter";
// interface LeagueOddsProps {
//   leagueName: string;
//   games: Game[];
//   isLoading: boolean;
//   isLeagueOpen: boolean;
//   setIsLeagueOpen: Dispatch<SetStateAction<boolean>>;
// }
// const LeagueOdds: React.FC<LeagueOddsProps> = ({
//   leagueName,
//   games,
//   isLeagueOpen,
//   setIsLeagueOpen,
//   isLoading,
// }) => {
//   return (
//     <div>
//       <CollapsableSection
//         title={`${leagueName} Odds`}
//         isOpen={isLeagueOpen}
//         onToggle={() => setIsLeagueOpen(!isLeagueOpen)}
//       />
//       {isLeagueOpen ? (
//         <div className="px-3">
//           {isLoading ? (
//             <div>Loading {leagueName} games...</div>
//           ) : (
//             <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-2">
//               {games.map((game) => (
//                 <div
//                   key={game.id}
//                   className="border border-gray-300 dark:border-gray-500 p-5 rounded-lg shadow-lg bg-neutral-300 dark:bg-neutral-500"
//                 >
//                   <div className="grid grid-cols-3 items-center">
//                     <div className="flex flex-col items-start gap-2">
//                       <div className="flex items-center gap-2">
//                         <Image
//                           src={game.awayTeam.logo}
//                           alt=""
//                           width={32}
//                           height={32}
//                           className="rounded-md"
//                         />
//                         <div>
//                           <div className="font-semibold">
//                             {game.awayTeam.ranking
//                               ? `${game.awayTeam.ranking} ${game.awayTeam.abbreviation}`
//                               : game.awayTeam.abbreviation}
//                           </div>
//                           <div className="text-xs">{game.awayTeam.record}</div>
//                         </div>
//                       </div>

//                       <div
//                         className={`text-sm ${game.final && game.winner === game.awayTeam.id ? "border-2 border-sky-50 dark:border-neutral-800" : ""}`}
//                       >
//                         <span className="text-xs block">Moneyline</span>
//                         <span className="font-semibold">
//                           {game.odds?.awayMoneyline}
//                         </span>
//                       </div>
//                       <div
//                         className={`text-sm ${game.final && game.odds?.awayCover ? "border-2 border-sky-50 dark:border-neutral-800" : ""}`}
//                       >
//                         <span className="text-xs block">Spread</span>
//                         <span className="font-semibold">
//                           {game.odds?.awayTeamSpread}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="flex flex-col items-center gap-3 px-4 text-sm">
//                       <div className="text-center">
//                         {game.final && game.odds?.over && (
//                           <div>
//                             TOTAL {game.odds.total} OVR{game.odds.overUnder}
//                           </div>
//                         )}
//                         {game.final && game.odds?.under && (
//                           <div>
//                             TOTAL {game.odds.total} U{game.odds.overUnder}
//                           </div>
//                         )}
//                         {game.final && game.odds?.push && (
//                           <div>
//                             TOTAL {game.odds.total} PUSH{game.odds.overUnder}
//                           </div>
//                         )}
//                         {!game.final && (
//                           <div className="font-semibold">
//                             O/U{game.odds?.overUnder}
//                           </div>
//                         )}
//                         <div className="text-xs">Total Points</div>
//                         <br />
//                         {game.final === false ? (
//                           <div className="text-xs">
//                             {dateFormatter.format(new Date(game.isoDate))}
//                           </div>
//                         ) : (
//                           <div className="text-m">
//                             {game.awayScore} - {game.homeScore}
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <div className="flex flex-col items-end gap-2">
//                       <div className="flex items-center gap-2">
//                         <div className="text-right">
//                           <div className="font-semibold">
//                             {game.homeTeam.ranking
//                               ? `${game.homeTeam.ranking} ${game.homeTeam.abbreviation}`
//                               : game.homeTeam.abbreviation}
//                           </div>
//                           <div className="text-xs">{game.homeTeam.record}</div>
//                         </div>

//                         <Image
//                           src={game.homeTeam.logo}
//                           alt=""
//                           width={32}
//                           height={32}
//                           className="rounded-md"
//                         />
//                       </div>

//                       <div
//                         className={`text-sm text-right ${game.final && game.winner === game.homeTeam.id ? "border-2 border-sky-50 dark:border-neutral-800" : ""}`}
//                       >
//                         <span className="text-xs block">Moneyline</span>
//                         <span className="font-semibold">
//                           {game.odds?.homeMoneyline}
//                         </span>
//                       </div>
//                       <div
//                         className={`text-sm text-right ${game.final && game.odds?.homeCover ? "border-2 border-sky-50 dark:border-neutral-800" : ""}`}
//                       >
//                         <span className="text-xs block">Spread</span>
//                         <span className="font-semibold">
//                           {game.odds?.homeTeamSpread}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ) : (
//         <></>
//       )}
//     </div>
//   );
// };

// export default LeagueOdds;
