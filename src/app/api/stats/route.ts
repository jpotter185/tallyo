import EspnService from "@/lib/espn/espnService";
import { parseLeagueId } from "@/lib/leagues/leagueConfig";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const espnService = new EspnService();
  const { searchParams } = new URL(request.url);
  const league = parseLeagueId(searchParams.get("league"));
  if (!league) {
    return new Response("Bad request: Invalid league", { status: 400 });
  }
  const gameId = searchParams.get("gameId") || "";
  const { statMap, scoringPlays } = await espnService.getStats(gameId, league);
  return NextResponse.json({
    stats: Array.from(statMap.entries()),
    scoringPlays: scoringPlays,
  });
}
