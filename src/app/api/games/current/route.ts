import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const league = searchParams.get("league");
  if (league !== "nfl" && league !== "cfb") {
    return new Response("Bad request: Invalid league", { status: 400 });
  }
  const games = await fetch(
    `https://api.tallyo.us/api/v1/games/current?league=${league}`,
  );
  const body = await games.json();

  return NextResponse.json(body.content);
}
