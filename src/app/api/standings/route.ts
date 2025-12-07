import EspnService from "@/lib/espn/EspnService";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const espnService = new EspnService();
  const { searchParams } = new URL(request.url);
  const league = searchParams.get("league");

  if (league !== "nfl" && league !== "cfb") {
    return new Response("Bad request: Invalid league", { status: 400 });
  }
  const standings: Standings[] = await espnService.getStandings(league);
  return NextResponse.json(standings);
}
