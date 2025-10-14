import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { HeaderConstants } from "../types/StandingsConstants";
import Image from "next/image";

interface StandingsProps {
  standings: Standings[];
}

const Standings: React.FC<StandingsProps> = ({ standings }) => {
  const [openStandings, setOpenStandings] = useState<{ [id: string]: boolean }>(
    {}
  );
  const [isStandingsOpen, setIsStandingsOpen] = useState<boolean>(false);
  const toggleOpenStandings = (id: string) => {
    setOpenStandings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="divide-x divide-gray-500">
      <div
        className="p-2 text-xl font-bold flex w-full items-center justify-between p-2"
        onClick={() => setIsStandingsOpen(!isStandingsOpen)}
      >
        Standings
        <ChevronDown
          textAnchor="end"
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
            isStandingsOpen ? "rotate-180" : ""
          }`}
        ></ChevronDown>
      </div>
      {isStandingsOpen &&
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
                <div>
                  <div
                    className="px-1 grid grid-cols-9 border border-gray-500 divide-x divide-gray-500"
                    key="header"
                  >
                    <div className="p-1 hidden md:inline">
                      {HeaderConstants.Rank.long}
                    </div>
                    <div className="p-1 inline md:hidden">
                      {HeaderConstants.Rank.short}
                    </div>
                    <div className="p-1 hidden md:inline">
                      {HeaderConstants.TeamName.long}
                    </div>
                    <div className="p-1 inline md:hidden">
                      {HeaderConstants.TeamName.short}
                    </div>
                    <div className="p-1 hidden md:inline">
                      {HeaderConstants.WinPercentage.long}
                    </div>
                    <div className="p-1 inline md:hidden">
                      {HeaderConstants.WinPercentage.short}
                    </div>
                    <div className="p-1 hidden md:inline">
                      {HeaderConstants.OverallRecord.long}
                    </div>
                    <div className="p-1 inline md:hidden">
                      {HeaderConstants.OverallRecord.short}
                    </div>
                    <div className="p-1 hidden md:inline">
                      {HeaderConstants.ConferenceRecord.long}
                    </div>
                    <div className="p-1 inline md:hidden">
                      {HeaderConstants.ConferenceRecord.short}
                    </div>
                    <div className="p-1 hidden md:inline">
                      {HeaderConstants.DivisionRecord.long}
                    </div>
                    <div className="p-1 inline md:hidden">
                      {HeaderConstants.DivisionRecord.short}
                    </div>
                    <div className="p-1 hidden md:inline">
                      {HeaderConstants.PointsFor.long}
                    </div>
                    <div className="p-1 inline md:hidden">
                      {HeaderConstants.PointsFor.short}
                    </div>
                    <div className="p-1 hidden md:inline">
                      {HeaderConstants.PointsAgainst.long}
                    </div>
                    <div className="p-1 inline md:hidden">
                      {HeaderConstants.PointsAgainst.short}
                    </div>
                    <div className="p-1 hidden md:inline">
                      {HeaderConstants.Differential.long}
                    </div>
                    <div className="p-1 inline md:hidden">
                      {HeaderConstants.Differential.short}
                    </div>
                  </div>
                  {standing.teams.map((team) => {
                    return (
                      <div
                        className="px-1 grid grid-cols-9 border border-gray-500 divide-x divide-gray-500"
                        key={team.id}
                      >
                        <div className="p-1 items-center">{team.seed}</div>
                        <div
                          className={`p-1 grid grid-cols-[auto_1fr_auto] items-center gap-1w-full h-auto object-contain`}
                        >
                          <Image
                            src={team.logo}
                            alt=""
                            width={24}
                            height={24}
                          />
                          <div className="p-1 items-center">
                            {team.abbreviation}
                          </div>
                        </div>
                        <div className="p-1 items-center">
                          {team.winpercent}
                        </div>
                        <div className="p-1 items-center">{team.record}</div>
                        <div className="p-1 items-center">{team.vsconf}</div>
                        <div className="p-1 items-center">{team.vsdiv}</div>
                        <div className="p-1 items-center">{team.pointsfor}</div>
                        <div className="p-1 items-center">
                          {team.pointsagainst}
                        </div>
                        <div className="p-1 items-center">
                          {team.differential}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default Standings;
