import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const league = searchParams.get("league");
  if (league !== "nfl" && league !== "cfb") {
    return new Response("Bad request: Invalid league", { status: 400 });
  }
  const games = await fetch(
    `http://192.168.1.175:8080/api/v1/games/current?league=${league}`,
  );
  const body = await games.json();
  console.log(body);

  return NextResponse.json(body.content);
}
