import { kv } from "@vercel/kv"
import { NextRequest, NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { headers } from "next/headers"

export const dynamic = "force-dynamic"



const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
})
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(10, "210 s"),
})

export async function GET() {
  const likes = await fetch("https://capable-tomcat-36667.upstash.io/get/likes", {
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
    }
  }).then(response => response.json()).then(data => data.result)
  return NextResponse.json({ likes }, {
    headers: {
      'Access-Control-Allow-Origin': 'https://assignment-3-devscale.vercel.app',
      'Access-Control-Allow-Methods': 'GET, POST',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function POST(request: NextRequest) {
  const ip = headers().get('x-real-ip') ?? "global"
  const rlresult = await ratelimit.limit(ip)

  if (!rlresult.success) {
    return NextResponse.json({ message: "Please dont spam this route :( (Rate Limited)" }, {
      headers: {
        'Access-Control-Allow-Origin': 'https://assignment-3-devscale.vercel.app',
        'Access-Control-Allow-Methods': 'GET, POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'X-RateLimit-Limit': rlresult.limit + '',
        'X-RateLimit-Remaining': rlresult.remaining + '',
      },
    })
  }

  const likes = await fetch("https://capable-tomcat-36667.upstash.io/incr/likes", {
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
    }
  }).then(response => response.json()).then(data => data.result)
  // const likes = await kv.incr("likes");
  return NextResponse.json({ likes }, {
    headers: {
      'Access-Control-Allow-Origin': 'https://assignment-3-devscale.vercel.app',
      'Access-Control-Allow-Methods': 'GET, POST',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'X-RateLimit-Limit': rlresult.limit + '',
      'X-RateLimit-Remaining': rlresult.remaining + '',
    },
  })
}