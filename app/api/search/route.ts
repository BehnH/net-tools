import lookupCerts from "@/lib/postgres/cert";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (domain) {
        const response = await lookupCerts(domain);
        return NextResponse.json(response);
    } else {
        return NextResponse.json({ error: 'No domain provided' });
    }
}
