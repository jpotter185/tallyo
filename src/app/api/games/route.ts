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
  const timezone = searchParams.get("timezone");

  const games = await fetch(
    `${process.env.BACKEND_URL}/api/v1/games?league=${league}${year ? `&year=${year}` : ""}${seasonType ? `&seasonType=${seasonType}` : ""}${week ? `&week=${week}` : ""}${date ? `&date=${date}` : ""}${timezone ? `&userTimeZone=${encodeURIComponent(timezone)}` : ""}`,
    {
      headers: {
        "x-api-key": process.env.API_KEY || "",
      },
    },
  );

  const rawBody = await games.text();
  if (!games.ok) {
    return new Response(rawBody || "Backend request failed", {
      status: games.status,
      headers: {
        "content-type": games.headers.get("content-type") || "text/plain",
      },
    });
  }

  const body = rawBody ? JSON.parse(rawBody) : {};
  return NextResponse.json(body.content ?? []);
}
