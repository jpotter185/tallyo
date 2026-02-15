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
  try {
    const { statMap, scoringPlays } = await espnService.getStats(
      gameId,
      league,
    );
    return NextResponse.json({
      stats: Array.from(statMap.entries()),
      scoringPlays: scoringPlays,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch stats";
    return NextResponse.json(
      { code: "UPSTREAM_ERROR", message, details: "Stats service failure" },
      { status: 502 },
    );
  }
}
