import { getNflStandings } from "@/lib/espnService";
import { NextResponse } from "next/server";

export async function GET() {
  const standings = await getNflStandings();

  return NextResponse.json(standings);
}
