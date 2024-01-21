import { NextResponse } from "next/server"

let likes = 0

export const dynamic = "force-dynamic"

export function GET() {
  return NextResponse.json({ likes })
}

export function POST() {
  likes++
  return NextResponse.json({ likes })
}