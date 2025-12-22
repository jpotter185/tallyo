import EspnService from "@/lib/espn/espnService";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const espnService = new EspnService();
  const { searchParams } = new URL(request.url);
  const league = searchParams.get("league");
  if (league !== "nfl" && league !== "cfb") {
    return new Response("Bad request: Invalid league", { status: 400 });
  }
  const week = searchParams.get("week") || undefined;
  const seasonType = searchParams.get("seasonType") || undefined;
  const scoreboardGroupId = searchParams.get("scoreboardGroupId") || undefined;
  const year = searchParams.get("year") || new Date().getFullYear().toString();
  const gameData = await espnService.getGames(
    league,
    week,
    seasonType,
    scoreboardGroupId,
    year,
  );

  return NextResponse.json(gameData);
}
