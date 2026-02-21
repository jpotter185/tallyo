import EspnService from "@/lib/espn/espnService";
import {
  getStandingsEndpoints,
  isEspnLeagueId,
} from "@/lib/espn/enums/espnEndpoints";
import { parseLeagueId } from "@/lib/leagues/leagueConfig";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const espnService = new EspnService();
  const { searchParams } = new URL(request.url);
  const league = parseLeagueId(searchParams.get("league"));
  if (
    !league ||
    !isEspnLeagueId(league) ||
    getStandingsEndpoints(league).length === 0
  ) {
    return new Response("Bad request: Invalid league", { status: 400 });
  }
  try {
    const standings: Standings[] = await espnService.getStandings(league);
    return NextResponse.json(standings);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch standings";
    return NextResponse.json(
      { code: "UPSTREAM_ERROR", message, details: "Standings service failure" },
      { status: 502 },
    );
  }
}
