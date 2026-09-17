import { NextRequest, NextResponse } from 'next/server';
import { LeadDiscoveryEngine } from '@/lib/engines/LeadDiscoveryEngine';
import { HybridBusinessDataProvider } from '@/lib/providers';
import { SearchParams } from '@/lib/providers/types';
import { CreditService } from '@/lib/services/credits';

export async function POST(request: NextRequest) {
  let userEmail = 'guest@leadforge.com';
  let transactionId: string | undefined;

  try {
    const body = await request.json();
    userEmail = body.userEmail || 'guest@leadforge.com';
    const userRole = body.userRole || 'user';
    const isPaidUser = body.isPaidUser || false;
    const userPlan = body.userPlan || 'free';

    // 1. SERVER-SIDE CREDIT CHECK & ATOMIC RESERVATION (1 Research Search = 1 Credit)
    const deduction = await CreditService.deductCredit({
      email: userEmail,
      role: userRole,
      isPaidUser,
      plan: userPlan,
      operation: `RESEARCH_${(body.niche || 'GENERAL').toUpperCase()}`,
    });

    if (!deduction.success) {
      return NextResponse.json(
        {
          error: 'INSUFFICIENT_CREDITS',
          message: deduction.message || 'Você não possui pesquisas suficientes para executar esta busca.',
          balance: deduction.balance || 0,
        },
        { status: 402 }
      );
    }

    transactionId = deduction.transactionId;

    // 2. EXECUTE RESEARCH DISCOVERY
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

    return NextResponse.json({
      ...result,
      creditConsumed: 1,
      remainingCredits: deduction.balance !== undefined ? Math.max(0, deduction.balance - 1) : undefined,
    });
  } catch (error: any) {
    console.error('[API /search] Discovery failed:', error);

    // 3. FAILURE RULE (RULE #15): Automatic refund if search failed before completion
    if (transactionId) {
      await CreditService.refundCredit({
        email: userEmail,
        transactionId,
        reason: error?.message || 'Search execution failed',
      });
    }

    return NextResponse.json(
      { error: 'Falha ao buscar leads', message: error?.message || String(error) },
      { status: 500 }
    );
  }
}
