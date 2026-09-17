import { NextRequest, NextResponse } from 'next/server';
import { AsaasService } from '@/lib/services/asaas';

export async function POST(request: NextRequest) {
  try {
    // 1. Verify webhook header security token
    const token = request.headers.get('asaas-access-token');
    if (!AsaasService.verifyWebhookToken(token)) {
      return NextResponse.json({ error: 'Token de webhook inválido' }, { status: 401 });
    }

    const payload = await request.json();
    const event = payload.event;
    const payment = payload.payment;
    const subscription = payload.subscription;

    console.log(`[Asaas Webhook] Received Event: ${event} ID: ${payload.id || payment?.id}`);

    switch (event) {
      case 'PAYMENT_CONFIRMED':
      case 'PAYMENT_RECEIVED': {
        // Payment confirmed! Unlock subscription & grant monthly research credits
        const customerId = payment?.customer || subscription?.customer;
        const externalRef = payment?.externalReference || subscription?.externalReference || '';
        
        console.log(`[Asaas Webhook] Payment Approved for Customer ${customerId} (Ref: ${externalRef})`);
        // In production with Supabase, trigger grant_subscription_credits procedure here
        break;
      }

      case 'PAYMENT_OVERDUE': {
        // Subscription past due
        console.log(`[Asaas Webhook] Payment Overdue for Subscription ${subscription?.id}`);
        break;
      }

      case 'SUBSCRIPTION_DELETED':
      case 'SUBSCRIPTION_INACTIVATED': {
        // Subscription canceled
        console.log(`[Asaas Webhook] Subscription Canceled: ${subscription?.id}`);
        break;
      }

      default:
        console.log(`[Asaas Webhook] Ignored unhandled event: ${event}`);
    }

    return NextResponse.json({ received: true, event });
  } catch (error: any) {
    console.error('[Asaas Webhook] Error processing event:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar webhook', message: error?.message || String(error) },
      { status: 500 }
    );
  }
}
