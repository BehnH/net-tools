import lookupCerts from "@/lib/postgres/cert";
import { getCache } from "@/lib/redis/redis";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');
  const cache = await getCache();

  if (domain) {
    const cached = await cache.get(domain);

    if (cached) {
      console.log('Cache hit for', domain);
      console.log(cached)
      return NextResponse.json(JSON.parse(cached));
    } else {
      const response = await lookupCerts(domain);
      return NextResponse.json(response);
    }
  } else {
    return NextResponse.json({ error: 'No domain provided' });
  }
}
