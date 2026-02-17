import { NextRequest, NextResponse } from "next/server";
import { parseLeagueId } from "@/lib/leagues/leagueConfig";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const league = parseLeagueId(searchParams.get("league"));
  const timezone = searchParams.get("timezone");
  const mode = searchParams.get("mode") ?? "season";
  if (!league) {
    return new Response("Bad request: Invalid league", { status: 400 });
  }
  const endpoint =
    mode === "date" ? "/api/v1/games/dates" : "/api/v1/games/context";
  const url = `${process.env.BACKEND_URL}${endpoint}?league=${league}${timezone ? `&userTimeZone=${encodeURIComponent(timezone)}` : ""}`;
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
