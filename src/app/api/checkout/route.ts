import { NextRequest, NextResponse } from 'next/server';
import { AsaasService } from '@/lib/services/asaas';
import { getPlanBySlug } from '@/lib/config/plans';
import { BillingStore } from '@/lib/services/billingStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planSlug, userEmail, apiKey } = body;

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

    // Determine host origin for dynamic callback URLs (Rule 8)
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const externalRef = `order_${Date.now()}_${userEmail.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')}_${plan.slug}`;

    // Create Checkout in Asaas V3 (POST /checkouts - Rule 3)
    const checkout = await AsaasService.createCheckout({
      name: `Plano ${plan.name} — LeadForge SaaS`,
      description: `Assinatura mensal do LeadForge (${plan.researchCredits} pesquisas/mês).`,
      price: plan.price,
      externalReference: externalRef,
      successUrl: `${baseUrl}/billing/success`,
      cancelUrl: `${baseUrl}/billing/cancelled`,
      expiredUrl: `${baseUrl}/billing/expired`,
      apiKey,
    });

    // Rule 4 & 5: Server-side Link & Status Validation
    if (!checkout?.link || typeof checkout.link !== 'string' || !checkout.link.startsWith('http')) {
      console.error('[API /api/checkout] Asaas returned an invalid checkout link:', checkout);
      return NextResponse.json(
        { error: 'Não foi possível gerar o pagamento agora. Tente novamente.' },
        { status: 502 }
      );
    }

    // Save internal order record (Rule 3)
    BillingStore.saveOrder({
      checkoutId: checkout.id,
      checkoutLink: checkout.link,
      checkoutStatus: checkout.status,
      externalReference: externalRef,
      userEmail: userEmail.trim().toLowerCase(),
      planSlug: plan.slug,
      amount: plan.price,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      checkoutId: checkout.id,
      checkoutUrl: checkout.link,
      checkoutStatus: checkout.status,
      externalReference: externalRef,
      planSlug: plan.slug,
      planName: plan.name,
      price: plan.price,
      researchCredits: plan.researchCredits,
    });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    console.error('[API /api/checkout] Failed to create checkout:', errorMsg);

    if (errorMsg.includes('MISSING_API_KEY')) {
      return NextResponse.json(
        {
          error: 'MISSING_API_KEY',
          message: 'Chave de API do Asaas (ASAAS_API_KEY) não foi configurada no servidor. Insira sua chave $aact_... do Sandbox para gerar faturas reais.',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Não foi possível criar o checkout de pagamento.', message: errorMsg },
      { status: 500 }
    );
  }
}
