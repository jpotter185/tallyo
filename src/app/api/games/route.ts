import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const league = searchParams.get("league");
  if (league !== "nfl" && league !== "cfb") {
    return new Response("Bad request: Invalid league", { status: 400 });
  }
  const week = searchParams.get("week") || "";
  const seasonType = searchParams.get("seasonType") || "";
  const year = searchParams.get("year") || new Date().getFullYear().toString();

  const games = await fetch(
    `http://192.168.1.175:8080/api/v1/games?league=${league}&year=${year}&seasonType=${seasonType}&week=${week}`,
  );
  const body = await games.json();
  console.log(body);

  return NextResponse.json(body.content);
}
