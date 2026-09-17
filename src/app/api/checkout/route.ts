import { NextRequest, NextResponse } from 'next/server';
import { AsaasService } from '@/lib/services/asaas';
import { getPlanBySlug } from '@/lib/config/plans';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planSlug, userEmail } = body;

    if (!planSlug || !userEmail) {
      return NextResponse.json(
        { error: 'Dados insuficientes. E-mail e plano são obrigatórios.' },
        { status: 400 }
      );
    }

    const plan = getPlanBySlug(planSlug);
    if (plan.slug === 'free') {
      return NextResponse.json({
        success: true,
        message: 'Plano gratuito ativado com sucesso!',
        planSlug: 'free',
        researchCredits: 5,
      });
    }

    // Create hosted Asaas payment link (Credit Card / PIX / Boleto)
    const paymentLink = await AsaasService.createPaymentLink({
      name: `LeadForge SaaS — Plano ${plan.name}`,
      description: `Assinatura mensal do LeadForge SaaS (${plan.researchCredits} pesquisas/mês).`,
      price: plan.price,
      externalReference: `user_${encodeURIComponent(userEmail)}_${plan.slug}`,
    });

    return NextResponse.json({
      success: true,
      planSlug: plan.slug,
      planName: plan.name,
      price: plan.price,
      researchCredits: plan.researchCredits,
      checkoutUrl: paymentLink.url,
    });
  } catch (error: any) {
    console.error('[API /api/checkout] Failed:', error);
    return NextResponse.json(
      { error: 'Falha ao processar checkout no gateway', message: error?.message || String(error) },
      { status: 500 }
    );
  }
}
