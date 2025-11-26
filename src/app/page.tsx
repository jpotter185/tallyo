"use client";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import League from "@/components/League";
import { cfbGroupIdMapping } from "@/lib/espn/transformers";
import Standings from "@/components/Standings";

export default function Home() {
  const [nflGames, setNflGames] = useState<Game[]>([]);
  const [cfbGames, setCfbGames] = useState<Game[]>([]);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isCfbOpen, setIsCfbOpen] = useState<boolean>(false);
  const [isNflOpen, setIsNflOpen] = useState<boolean>(false);
  const [nflWeek, setNflWeek] = useState<string>("");
  const [cfbWeek, setCfbWeek] = useState<string>("");
  const [cfbScoreboardGroup, setCfbScoreboardGroup] = useState<string>("-1");
  const [openGames, setOpenGames] = useState<{ [id: string]: boolean }>({});
  const [nflStandings, setNflStandings] = useState<Standings[]>([]);
  const toggleOpenGame = (id: string) => {
    setOpenGames((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const fetchNflStandings = async () => {
      try {
        const res = await fetch("/api/nfl-standings");
        const data = await res.json();
        setNflStandings(data);
      } catch (error) {
        console.error("failed to fetch scoreboard ", error);
      }
    };
    fetchNflStandings();
  }, []);

  useEffect(() => {
    const fetchNflGames = async () => {
      try {
        const res = await fetch(
          `/api/games?league=nfl${nflWeek ? `&week=${nflWeek}` : ""}`
        );
        const data = await res.json();

        setNflGames(data.games || []);
        setNflWeek(data.dataWeek);
        if (data.week?.number) setNflWeek(data.week.number.toString());
      } catch (error) {
        console.error("failed to fetch nfl games ", error);
      }
    };
    fetchNflGames();
    const interval = setInterval(fetchNflGames, 10000);
    return () => clearInterval(interval);
  }, [nflWeek]);

  useEffect(() => {
    const fetchCfbGames = async () => {
      try {
        const res = await fetch(
          `/api/games?league=cfb${cfbWeek ? `&week=${cfbWeek}` : ""}${
            cfbScoreboardGroup ? `&scoreboardGroupId=${cfbScoreboardGroup}` : ""
          }`
        );
        const data = await res.json();
        setCfbGames(data.games || []);
        setCfbWeek(data.dataWeek);
        setCfbScoreboardGroup(data.scoreboardGroupId);
        if (data.week?.number) setCfbWeek(data.week.number.toString());
      } catch (error) {
        console.error("error getting cfb games ", error);
      }
    };
    fetchCfbGames();
    const interval = setInterval(fetchCfbGames, 10000);
    return () => clearInterval(interval);
  }, [cfbWeek, cfbScoreboardGroup]);

  let cfbFirst = true;
  const today = new Date();
  if (today.getDay() === 0 || today.getDay() === 1) {
    cfbFirst = false;
  }

  return (
    <div className="bg-sky-50 dark:bg-neutral-800 border border-gray-500 divide-y divide-x divide-gray-500">
      <Header />
      {cfbFirst ? (
        <div>
          <League
            leagueName="CFB"
            games={cfbGames}
            isOpen={isCfbOpen}
            setIsOpen={setIsCfbOpen}
            week={cfbWeek}
            setWeek={setCfbWeek}
            numberOfWeeks={16}
            scoreboardGroups={Array.from(cfbGroupIdMapping.keys())}
            currentScoreboardGroup={cfbScoreboardGroup}
            setCurrentScoreboardGroup={setCfbScoreboardGroup}
            displayMap={cfbGroupIdMapping}
            openGames={openGames}
            toggleOpenGame={toggleOpenGame}
          />
          <League
            leagueName="NFL"
            games={nflGames}
            isOpen={isNflOpen}
            setIsOpen={setIsNflOpen}
            week={nflWeek}
            setWeek={setNflWeek}
            numberOfWeeks={18}
            scoreboardGroups={[]}
            currentScoreboardGroup=""
            setCurrentScoreboardGroup={() => undefined}
            openGames={openGames}
            toggleOpenGame={toggleOpenGame}
          />
        </div>
      ) : (
        <div>
          <League
            leagueName="NFL"
            games={nflGames}
            isOpen={isNflOpen}
            setIsOpen={setIsNflOpen}
            week={nflWeek}
            setWeek={setNflWeek}
            numberOfWeeks={18}
            scoreboardGroups={[]}
            currentScoreboardGroup=""
            setCurrentScoreboardGroup={() => undefined}
            openGames={openGames}
            toggleOpenGame={toggleOpenGame}
          />
          <League
            leagueName="CFB"
            games={cfbGames}
            isOpen={isCfbOpen}
            setIsOpen={setIsCfbOpen}
            week={cfbWeek}
            setWeek={setCfbWeek}
            numberOfWeeks={16}
            scoreboardGroups={Array.from(cfbGroupIdMapping.keys())}
            currentScoreboardGroup={cfbScoreboardGroup}
            setCurrentScoreboardGroup={setCfbScoreboardGroup}
            displayMap={cfbGroupIdMapping}
            openGames={openGames}
            toggleOpenGame={toggleOpenGame}
          />
        </div>
      )}

      <Standings standings={nflStandings} />
      <Footer isOpen={isContactOpen} setIsOpen={setIsContactOpen} />
    </div>
  );
}
