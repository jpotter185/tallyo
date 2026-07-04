import { NextResponse } from "next/server";
import {
  jsonBody,
  passthroughError,
  proxyBackend,
} from "@/app/api/_lib/backendProxy";

export async function GET() {
  const response = await proxyBackend("/api/v1/leagues");

  if (!response.ok) {
    return passthroughError(response);
  }
  return NextResponse.json(await jsonBody<unknown[]>(response, []));
}
