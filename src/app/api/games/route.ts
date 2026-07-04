import { NextResponse } from "next/server";
import { parseLeagueId } from "@/lib/leagues/leagueConfig";
import {
  jsonBody,
  passthroughError,
  proxyBackend,
} from "@/app/api/_lib/backendProxy";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const league = parseLeagueId(searchParams.get("league"));
  if (!league) {
    return new Response("Bad request: Invalid league", { status: 400 });
  }

  const response = await proxyBackend("/api/v1/games", {
    params: {
      league,
      year: searchParams.get("year"),
      seasonType: searchParams.get("seasonType"),
      week: searchParams.get("week"),
      date: searchParams.get("date"),
      timezone: searchParams.get("timezone"),
    },
  });

  if (!response.ok) {
    return passthroughError(response);
  }
  const body = await jsonBody<{ content?: unknown[] }>(response, {});
  return NextResponse.json(body.content ?? []);
}
