import { NextResponse } from "next/server";
import { parseLeagueId } from "@/lib/leagues/leagueConfig";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const league = parseLeagueId(searchParams.get("league"));
  const timezone = searchParams.get("timezone");
  if (!league) {
    return new Response("Bad request: Invalid league", { status: 400 });
  }
  const games = await fetch(
    `${process.env.BACKEND_URL}/api/v1/games/current?league=${league}${timezone ? `&userTimeZone=${encodeURIComponent(timezone)}` : ""}`,
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
