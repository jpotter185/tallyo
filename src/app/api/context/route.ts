import { NextRequest, NextResponse } from "next/server";
import { LEAGUE_CONFIG, parseLeagueId } from "@/lib/leagues/leagueConfig";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const league = parseLeagueId(searchParams.get("league"));
  if (!league) {
    return new Response("Bad request: Invalid league", { status: 400 });
  }
  const contextEndpoint = LEAGUE_CONFIG[league].contextEndpoint.replace(
    "{league}",
    league,
  );
  const context = await fetch(`${process.env.BACKEND_URL}${contextEndpoint}`, {
    headers: {
      "x-api-key": process.env.API_KEY || "",
    },
  });
  const data = await context.json();

  return NextResponse.json(data);
}
