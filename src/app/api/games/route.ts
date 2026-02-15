import { NextResponse } from "next/server";
import { parseLeagueId } from "@/lib/leagues/leagueConfig";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const league = parseLeagueId(searchParams.get("league"));
  if (!league) {
    return new Response("Bad request: Invalid league", { status: 400 });
  }
  const week = searchParams.get("week");
  const seasonType = searchParams.get("seasonType");
  const year = searchParams.get("year");
  const date = searchParams.get("date");

  const games = await fetch(
    `${process.env.BACKEND_URL}/api/v1/games?league=${league}${year ? `&year=${year}` : ""}${seasonType ? `&seasonType=${seasonType}` : ""}${week ? `&week=${week}` : ""}${date ? `&date=${date}` : ""}`,
    {
      headers: {
        "x-api-key": process.env.API_KEY || "",
      },
    },
  );
  const body = await games.json();

  return NextResponse.json(body.content);
}
