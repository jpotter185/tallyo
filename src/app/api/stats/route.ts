import EspnService from "@/lib/espn/espnService";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const espnService = new EspnService();
  const { searchParams } = new URL(request.url);
  const leagueParam = searchParams.get("league");
  const league = leagueParam === "NFL" || leagueParam === "nfl" ? "nfl" : "cfb";
  if (league !== "nfl" && league !== "cfb") {
    return new Response("Bad request: Invalid league", { status: 400 });
  }
  const gameId = searchParams.get("gameId") || "";
  const { statMap, scoringPlays } = await espnService.getStats(gameId, league);
  return NextResponse.json({
    stats: Array.from(statMap.entries()),
    scoringPlays: scoringPlays,
  });
}
