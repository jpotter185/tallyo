import SportPage from "@/components/SportPage";
import { parseLeagueId } from "@/lib/leagues/leagueConfig";
import { notFound } from "next/navigation";

interface LeaguePageProps {
  params: Promise<{
    league: string;
  }>;
}

export default async function LeaguePage({ params }: LeaguePageProps) {
  const { league: leagueParam } = await params;
  const league = parseLeagueId(leagueParam);
  if (!league) {
    notFound();
  }
  return <SportPage league={league} />;
}
