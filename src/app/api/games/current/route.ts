import { NextResponse } from "next/server";
import { parseLeagueId } from "@/lib/leagues/leagueConfig";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const league = parseLeagueId(searchParams.get("league"));
  if (!league) {
    return new Response("Bad request: Invalid league", { status: 400 });
  }
  const games = await fetch(
    `${process.env.BACKEND_URL}/api/v1/games/current?league=${league}`,
    {
      headers: {
        "x-api-key": process.env.API_KEY || "",
      },
    },
  );
  const body = await games.json();

  return NextResponse.json(body.content);
}
