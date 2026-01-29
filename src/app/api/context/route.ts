import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const league = searchParams.get("league");

  if (league === "nhl") {
    const context = await fetch(
      `${process.env.BACKEND_URL}/api/v1/games/nhl-dates`,
      {
        headers: {
          "x-api-key": process.env.API_KEY || "",
        },
      },
    );
    const data = await context.json();
    return NextResponse.json(data);
  } else {
    const context = await fetch(
      `${process.env.BACKEND_URL}/api/v1/games/context?league=${league}`,
      {
        headers: {
          "x-api-key": process.env.API_KEY || "",
        },
      },
    );
    const data = await context.json();

    return NextResponse.json(data);
  }
}
