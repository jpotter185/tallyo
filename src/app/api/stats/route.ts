import { getCfbStatsForGame, getNflStatsForGame } from "@/lib/espnService";
import { NextResponse } from "next/server";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const league = searchParams.get("league");
  if (league !== "nfl" && league !== "cfb") {
    return new Response("Bad request: Invalid league", { status: 400 });
  }
  const gameId = searchParams.get("gameId") || "";
  let statsForGame = new Map<string, Stat>();
  if (league === "nfl") {
    statsForGame = await getNflStatsForGame(gameId);
  } else if (league === "cfb") {
    statsForGame = await getCfbStatsForGame(gameId);
  }
  return NextResponse.json({ data: Array.from(statsForGame.entries()) });
}
