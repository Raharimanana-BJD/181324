import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Rediriger vers la vraie route API
  const apiUrl = new URL("/api/webhooks/stripe", req.url);
  
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: req.headers,
    body: await req.text(),
  });

  return new NextResponse(response.body, {
    status: response.status,
    headers: response.headers,
  });
} 