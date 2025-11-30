import { getCfbGames, getNflGames } from "@/lib/espn/espnService";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const league = searchParams.get("league");
  if (league !== "nfl" && league !== "cfb") {
    return new Response("Bad request: Invalid league", { status: 400 });
  }
  const week = searchParams.get("week") || undefined;
  const scoreboardGroupId = searchParams.get("scoreboardGroupId") || undefined;
  let games;
  if (league === "nfl") {
    games = await getNflGames(week);
  }
  if (league === "cfb") {
    games = await getCfbGames(week, scoreboardGroupId);
  }
  return NextResponse.json(games);
}
