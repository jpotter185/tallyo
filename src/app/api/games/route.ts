import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const league = searchParams.get("league");
  if (!["nfl", "cfb", "nhl"].includes(String(league))) {
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
