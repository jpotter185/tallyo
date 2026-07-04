import { NextResponse } from "next/server";
import {
  jsonBody,
  passthroughError,
  proxyBackend,
} from "@/app/api/_lib/backendProxy";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ gameId: string }> },
) {
  const { gameId } = await params;
  if (!/^\d+$/.test(gameId)) {
    return new Response("Bad request: Invalid game id", { status: 400 });
  }

  const response = await proxyBackend(`/api/v1/games/${gameId}/details`);

  if (!response.ok) {
    return passthroughError(response);
  }
  return NextResponse.json(await jsonBody<unknown>(response, {}));
}
