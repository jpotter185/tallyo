import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { HeaderConstants } from "../types/StandingsConstants";
import Image from "next/image";

interface StandingsProps {
  standings: Standings[];
  isLoading: boolean;
  league: string;
}

const Standings: React.FC<StandingsProps> = ({
  standings,
  isLoading,
  league,
}) => {
  const [openStandings, setOpenStandings] = useState<{ [id: string]: boolean }>(
    {},
  );
  const [isStandingsOpen, setIsStandingsOpen] = useState<boolean>(false);
  const toggleOpenStandings = (id: string) => {
    setOpenStandings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const columns = [
    {
      id: "rank",
      header: HeaderConstants.Rank,
      render: (team: Team) => team.seed,
      sticky: false,
    },
    {
      id: "team",
      header: HeaderConstants.TeamName,
      render: (team: Team) => (
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-1">
          <Image src={team.logo} alt="" width={24} height={24} />
          {team.abbreviation}
        </div>
      ),
      sticky: true,
    },

    {
      id: "record",
      header: HeaderConstants.OverallRecord,
      render: (t: Team) => t.record || t.total,
      sticky: false,
    },
  ];

  // only NFL gets these columns
  if (league === "NFL") {
    columns.push({
      id: "wp",
      header: HeaderConstants.WinPercentage,
      render: (t: Team) => t.winpercent,
      sticky: false,
    });
    columns.push({
      id: "vsdiv",
      header: HeaderConstants.DivisionRecord,
      render: (t: Team) => t.vsdiv,
      sticky: false,
    });
  }

  columns.push(
    {
      id: "vsconf",
      header: HeaderConstants.ConferenceRecord,
      render: (t: Team) => t.vsconf,
      sticky: false,
    },
    {
      id: "pf",
      header: HeaderConstants.PointsFor,
      render: (t) => t.pointsfor,
      sticky: false,
    },
    {
      id: "pa",
      header: HeaderConstants.PointsAgainst,
      render: (t: Team) => t.pointsagainst,
      sticky: false,
    },
    {
      id: "diff",
      header: HeaderConstants.Differential,
      render: (t: Team) => t.differential,
      sticky: false,
    },
  );

  return (
    <div className="divide-x divide-gray-500">
      <div
        className="p-2 text-xl font-bold flex w-full items-center justify-between p-2"
        onClick={() => setIsStandingsOpen(!isStandingsOpen)}
      >
        {league ? `${league} Standings` : "Standings"}
        <ChevronDown
          textAnchor="end"
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
            isStandingsOpen ? "rotate-180" : ""
          }`}
        ></ChevronDown>
      </div>
      {isStandingsOpen && isLoading && <div>Loading...</div>}
      {isStandingsOpen &&
        !isLoading &&
        standings.map((standing) => {
          return (
            <div key={standing.groupName}>
              <div
                className="flex w-full items-center justify-between p-2"
                onClick={() => toggleOpenStandings(standing.groupName)}
              >
                <div className="p-1">{standing.groupName}</div>
                <ChevronDown
                  textAnchor="end"
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                    openStandings[standing.groupName] ? "rotate-180" : ""
                  }`}
                ></ChevronDown>
              </div>
              {openStandings[standing.groupName] && (
                <div className="overflow-x-auto">
                  <div className="min-w-[700px]">
                    <div
                      className={`px-1 grid border border-gray-500 divide-x divide-gray-500`}
                      style={{
                        gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
                      }}
                      key="header"
                    >
                      {columns.map((col) => (
                        <div
                          key={col.id}
                          className={`p-1 ${
                            col.sticky
                              ? "sticky left-0 z-20 bg-sky-50 dark:bg-neutral-800"
                              : ""
                          }`}
                        >
                          <div className="hidden md:inline">
                            {col.header.long}
                          </div>
                          <div className="inline md:hidden">
                            {col.header.short}
                          </div>
                        </div>
                      ))}
                    </div>
                    {standing.teams.map((team) => {
                      return (
                        <div
                          className={`px-1 grid border border-gray-500 divide-x divide-gray-500`}
                          style={{
                            gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
                          }}
                          key={team.id}
                        >
                          {columns.map((col) => (
                            <div
                              key={col.id}
                              className={`p-1 ${
                                col.sticky
                                  ? "sticky left-0 z-10 bg-sky-50 dark:bg-neutral-800"
                                  : ""
                              }`}
                            >
                              {col.render(team)}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default Standings;
