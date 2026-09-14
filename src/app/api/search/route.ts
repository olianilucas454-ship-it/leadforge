import { NextRequest, NextResponse } from 'next/server';
import { LeadDiscoveryEngine } from '@/lib/engines/LeadDiscoveryEngine';
import { HybridBusinessDataProvider } from '@/lib/providers';
import { SearchParams } from '@/lib/providers/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const searchParams: SearchParams = {
      niche: body.niche || 'Barbearias',
      city: body.city || 'Goiânia',
      state: body.state || 'GO',
      neighborhood: body.neighborhood || undefined,
      radiusKm: Number(body.radiusKm || body.radius || 25),
      limit: Number(body.limit || body.quantity || 50),
      searchSource: body.searchSource || 'google_maps',
      minRating: body.minRating ? Number(body.minRating) : undefined,
    };

    const provider = new HybridBusinessDataProvider();
    const engine = new LeadDiscoveryEngine(provider as any);

    const result = await engine.discover(searchParams as any);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API /search] Discovery failed:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar leads', message: error?.message || String(error) },
      { status: 500 }
    );
  }
}
