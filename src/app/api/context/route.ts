import { NextRequest, NextResponse } from "next/server";
import { LEAGUE_CONFIG, parseLeagueId } from "@/lib/leagues/leagueConfig";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const league = parseLeagueId(searchParams.get("league"));
  const timezone = searchParams.get("timezone");
  if (!league) {
    return new Response("Bad request: Invalid league", { status: 400 });
  }
  const contextEndpoint = LEAGUE_CONFIG[league].contextEndpoint.replace(
    "{league}",
    league,
  );
  const url = `${process.env.BACKEND_URL}${contextEndpoint}${timezone ? `${contextEndpoint.includes("?") ? "&" : "?"}userTimeZone=${encodeURIComponent(timezone)}` : ""}`;
  const context = await fetch(url, {
    headers: {
      "x-api-key": process.env.API_KEY || "",
    },
  });

  const rawBody = await context.text();
  if (!context.ok) {
    return new Response(rawBody || "Backend request failed", {
      status: context.status,
      headers: {
        "content-type": context.headers.get("content-type") || "text/plain",
      },
    });
  }

  const data = rawBody ? JSON.parse(rawBody) : {};
  return NextResponse.json(data);
}
