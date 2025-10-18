import { getCfbStatsForGame, getNflStatsForGame } from "@/lib/espnService";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const league = searchParams.get("league");
  if (league !== "nfl" && league !== "cfb") {
    return new Response("Bad request: Invalid league", { status: 400 });
  }
  const gameId = searchParams.get("gameId") || "";
  if (league === "nfl") {
    const { statMap, scoringPlays } = await getNflStatsForGame(gameId);
    return NextResponse.json({
      stats: Array.from(statMap.entries()),
      scoringPlays: scoringPlays,
    });
  } else if (league === "cfb") {
    const { statMap, scoringPlays } = await getCfbStatsForGame(gameId);
    return NextResponse.json({
      stats: Array.from(statMap.entries()),
      scoringPlays: scoringPlays,
    });
  }
}
