import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get("league");
    const year =
      searchParams.get("year") || new Date().getFullYear().toString();

    if (!league) {
      return NextResponse.json(
        { error: "League parameter is required" },
        { status: 400 },
      );
    }

    const url = `https://site.api.espn.com/apis/site/v2/sports/football/${league}/scoreboard?year=${year}`;

    const response = await fetch(url, {
      // Add caching since calendar data doesn't change often
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`ESPN API returned ${response.status}`);
    }

    const data = await response.json();

    const calendar = data.leagues?.[0]?.calendar || [];

    return NextResponse.json({
      calendar,
      year: parseInt(year),
      league,
    });
  } catch (error) {
    console.error("Calendar API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar data" },
      { status: 500 },
    );
  }
}
