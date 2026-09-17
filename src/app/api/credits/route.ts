import { NextRequest, NextResponse } from 'next/server';
import { PLAN_CONFIG } from '@/lib/config/plans';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || '';
    const planSlug = searchParams.get('plan') || 'free';
    const isPaid = searchParams.get('isPaid') === 'true';
    const isAdmin = email.toLowerCase() === 'olianilucas454@gmail.com';

    const plan = PLAN_CONFIG[planSlug as keyof typeof PLAN_CONFIG] || PLAN_CONFIG.free;

    const responseData = {
      email,
      planSlug: plan.slug,
      planName: plan.name,
      balance: isAdmin ? 999999 : (isPaid ? plan.researchCredits : 5),
      monthlyAllowance: plan.researchCredits,
      unlimited: isAdmin,
      billingPeriodEnd: new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    return NextResponse.json({ error: 'Falha ao buscar saldo de créditos' }, { status: 500 });
  }
}
