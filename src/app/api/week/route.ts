import { getCurrentCfbWeek, getCurrentNflWeek } from "@/lib/espn/espnService";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const league = searchParams.get("league");
  if (league !== "nfl" && league !== "cfb") {
    return new Response("Bad request: Invalid league", { status: 400 });
  }
  let dataWeek = "";
  if (league === "nfl") {
    dataWeek = await getCurrentNflWeek();
  } else if (league === "cfb") {
    dataWeek = await getCurrentCfbWeek();
  }
  return NextResponse.json(dataWeek);
}
