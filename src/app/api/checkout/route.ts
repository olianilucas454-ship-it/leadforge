import { NextRequest, NextResponse } from 'next/server';
import { AsaasService } from '@/lib/services/asaas';
import { PLAN_CONFIG, getPlanBySlug } from '@/lib/config/plans';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planSlug, userEmail, userName, cpfCnpj, phone } = body;

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

    // 1. Create or get customer in Asaas Gateway
    const customer = await AsaasService.getOrCreateCustomer({
      email: userEmail,
      name: userName || userEmail.split('@')[0],
      cpfCnpj: cpfCnpj || undefined,
      phone: phone || undefined,
    });

    // 2. Create Asaas subscription
    const subscription = await AsaasService.createSubscription({
      customerId: customer.id,
      planSlug: plan.slug as 'starter' | 'pro' | 'agency',
      price: plan.price,
      description: `LeadForge SaaS — Plano ${plan.name} (${plan.researchCredits} pesquisas/mês)`,
      externalReference: `user_${encodeURIComponent(userEmail)}_${plan.slug}`,
    });

    return NextResponse.json({
      success: true,
      planSlug: plan.slug,
      planName: plan.name,
      price: plan.price,
      researchCredits: plan.researchCredits,
      asaasCustomerId: customer.id,
      asaasSubscriptionId: subscription.id,
      checkoutUrl: subscription.invoiceUrl || `https://sandbox.asaas.com/i/${subscription.id}`,
    });
  } catch (error: any) {
    console.error('[API /api/checkout] Failed:', error);
    return NextResponse.json(
      { error: 'Falha ao processar checkout no gateway', message: error?.message || String(error) },
      { status: 500 }
    );
  }
}
