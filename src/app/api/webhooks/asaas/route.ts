import { NextRequest, NextResponse } from 'next/server';
import { AsaasService } from '@/lib/services/asaas';
import { BillingStore } from '@/lib/services/billingStore';

export async function POST(request: NextRequest) {
  try {
    // 1. Verify webhook header security token
    const token = request.headers.get('asaas-access-token');
    if (!AsaasService.verifyWebhookToken(token)) {
      console.warn('[Asaas Webhook] Unauthorized access attempt with invalid token');
      return NextResponse.json({ error: 'Token de webhook inválido' }, { status: 401 });
    }

    const payload = await request.json();
    const event = payload.event;
    const payment = payload.payment;
    const checkout = payload.checkout;
    const subscription = payload.subscription;

    // Extract unique event ID for Idempotency (Rule 10)
    const eventId = payload.id || payment?.id || checkout?.id || subscription?.id || `evt_${Date.now()}`;
    const externalRef = payment?.externalReference || checkout?.externalReference || subscription?.externalReference || '';

    console.log(`[Asaas Webhook] Received Event: ${event} (Event ID: ${eventId}, Ref: ${externalRef})`);

    // 2. IDEMPOTENCY CHECK (Rule 10): Avoid double-granting credits if event reenviado
    if (BillingStore.isEventProcessed(eventId)) {
      console.log(`[Asaas Webhook] Idempotent hit: Event ${eventId} already processed. Skipping credit grant.`);
      return NextResponse.json({ received: true, idempotent: true, event }, { status: 200 });
    }

    switch (event) {
      case 'CHECKOUT_PAID':
      case 'PAYMENT_CONFIRMED':
      case 'PAYMENT_RECEIVED': {
        // Parse userEmail and planSlug from externalReference (e.g. order_1720000_user_at_email_com_pro)
        let userEmail = '';
        let planSlug = 'pro';

        const existingOrder = BillingStore.getOrder(externalRef) || (checkout?.id ? BillingStore.getOrder(checkout.id) : undefined);
        
        if (existingOrder) {
          userEmail = existingOrder.userEmail;
          planSlug = existingOrder.planSlug;
          existingOrder.status = 'PAID';
          existingOrder.paidAt = new Date().toISOString();
        } else if (externalRef) {
          const parts = externalRef.split('_');
          if (parts.length >= 4) {
            planSlug = parts[parts.length - 1];
            userEmail = parts.slice(2, parts.length - 1).join('_').replace(/_at_/g, '@');
          }
        }

        if (userEmail && planSlug) {
          // Rule 11: Activate plan & grant exact research credits (Starter: 50, Pro: 200, Agency: 600)
          const subRecord = BillingStore.activatePaidSubscription(userEmail, planSlug);
          console.log(`[Asaas Webhook] SUCCESS! Granted ${subRecord.creditsRemaining} credits to ${userEmail} for Plan: ${planSlug}`);
        } else {
          console.warn(`[Asaas Webhook] Payment confirmed but could not parse userEmail or planSlug from Ref: ${externalRef}`);
        }

        // Mark event as processed in Idempotency Ledger
        BillingStore.markEventProcessed(eventId, event);
        break;
      }

      case 'CHECKOUT_CANCELED':
      case 'CHECKOUT_EXPIRED':
      case 'PAYMENT_OVERDUE':
      case 'SUBSCRIPTION_DELETED':
      case 'SUBSCRIPTION_INACTIVATED': {
        console.log(`[Asaas Webhook] Order/Subscription canceled or expired for Ref: ${externalRef}`);
        const existingOrder = BillingStore.getOrder(externalRef);
        if (existingOrder) {
          existingOrder.status = event.includes('CANCELED') ? 'CANCELLED' : 'EXPIRED';
        }
        BillingStore.markEventProcessed(eventId, event);
        break;
      }

      default:
        console.log(`[Asaas Webhook] Ignored unhandled event: ${event}`);
        BillingStore.markEventProcessed(eventId, event);
    }

    return NextResponse.json({ received: true, event, status: 'processed' }, { status: 200 });
  } catch (error: any) {
    console.error('[Asaas Webhook] Exception during webhook processing:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar webhook', message: error?.message || String(error) },
      { status: 500 }
    );
  }
}
