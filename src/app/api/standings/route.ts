import { getCfbStandings, getNflStandings } from "@/lib/espn/espnService";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const league = searchParams.get("league");

  if (league !== "nfl" && league !== "cfb") {
    return new Response("Bad request: Invalid league", { status: 400 });
  }
  let standings: Standings[] = [];
  if (league === "nfl") {
       standings = await getNflStandings();
    } else if (league === "cfb") {
      standings = await getCfbStandings();
    }

  return NextResponse.json(standings);
}
