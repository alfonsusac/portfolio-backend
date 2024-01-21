import { kv } from "@vercel/kv"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"


export async function GET() {
  const likes = await kv.get<number>("likes") ?? 0;
  return NextResponse.json({ likes }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function POST() {
  const likes = await kv.incr("likes");
  return NextResponse.json({ likes }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}