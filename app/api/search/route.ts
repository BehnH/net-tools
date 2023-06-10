import { lookupCerts, lookupCertsWithoutExpired } from "@/lib/postgres/cert";
import { getCache } from "@/lib/redis/redis";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');
  const excludeExpired = searchParams.get('excludeExpired');
  const cache = await getCache();

  if (domain) {
    if (excludeExpired) {
      const cached = await cache.get(`non-expired-${domain}`);

      if (cached) {
        console.log('Cache hit for', domain);
        return NextResponse.json(JSON.parse(cached));
      } else {
        const response = await lookupCertsWithoutExpired(domain, false);
        return NextResponse.json(response);
      }

    } else {
      const cached = await cache.get(`all-${domain}`);

      if (cached) {
        console.log('Cache hit for', domain);
        return NextResponse.json(JSON.parse(cached));
      } else {
        const response = await lookupCerts(domain, false);
        return NextResponse.json(response);
      }
    }
  } else {
    return NextResponse.json({ error: 'No domain provided' });
  }
}
