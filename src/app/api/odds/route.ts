import EspnService from "@/lib/espn/EspnService";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const espnService = new EspnService();
  const { searchParams } = new URL(request.url);
  const league = searchParams.get("league");
  const eventId = searchParams.get("eventId");

  if (league !== "nfl" && league !== "cfb") {
    return new Response("Bad request: Invalid league", { status: 400 });
  }
  if (!eventId) {
    return new Response("Bad request: eventId is required", { status: 400 });
  }

  try {
    const odds = await espnService.getOdds(league, eventId);
    return NextResponse.json(odds);
  } catch (error) {
    console.error(
      `Failed to get odds for league:${league} and eventId:${eventId}, error:${error}`,
    );
  }
}
