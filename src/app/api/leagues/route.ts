import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch(`${process.env.BACKEND_URL}/api/v1/leagues`, {
    headers: {
      "x-api-key": process.env.API_KEY || "",
    },
  });

  const rawBody = await response.text();
  if (!response.ok) {
    return new Response(rawBody || "Backend request failed", {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") || "text/plain",
      },
    });
  }

  const data = rawBody ? JSON.parse(rawBody) : [];
  return NextResponse.json(data);
}
