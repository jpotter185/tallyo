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

  const response = await proxyBackend("/api/v1/standings", {
    params: { league },
  });

  if (!response.ok) {
    return passthroughError(response);
  }
  return NextResponse.json(await jsonBody<unknown[]>(response, []));
}
