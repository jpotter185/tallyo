import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const league = searchParams.get("league");

  const context = await fetch(
    `http://192.168.1.175:8080/api/v1/games/context?league=${league}`,
  );
  const data = await context.json();

  return NextResponse.json(data);
}
