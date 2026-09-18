/**
 * LEADFORGE SERVER-SIDE BILLING STORE & IDEMPOTENCY LEDGER
 * Server ledger for tracking pending & paid checkout orders,
 * active subscriptions, credit balances, and processed webhook events.
 */

export interface CheckoutOrder {
  checkoutId: string;
  checkoutLink: string;
  checkoutStatus: string;
  externalReference: string;
  userEmail: string;
  planSlug: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED';
  createdAt: string;
  paidAt?: string;
}

export interface ProcessedWebhookEvent {
  eventId: string;
  eventType: string;
  processedAt: string;
}

export interface UserSubscriptionRecord {
  userEmail: string;
  planSlug: string;
  creditsRemaining: number;
  monthlyAllowance: number;
  isPaidUser: boolean;
  updatedAt: string;
}

class ServerBillingLedger {
  private orders = new Map<string, CheckoutOrder>();
  private processedEvents = new Map<string, ProcessedWebhookEvent>();
  private subscriptions = new Map<string, UserSubscriptionRecord>();

  /**
   * Save a newly created checkout order
   */
  public saveOrder(order: CheckoutOrder): void {
    this.orders.set(order.checkoutId, order);
    if (order.externalReference) {
      this.orders.set(order.externalReference, order);
    }
  }

  /**
   * Find order by checkoutId or externalReference
   */
  public getOrder(key: string): CheckoutOrder | undefined {
    return this.orders.get(key);
  }

  /**
   * Check if a webhook event ID was already processed (Idempotency - Rule 10)
   */
  public isEventProcessed(eventId: string): boolean {
    if (!eventId) return false;
    return this.processedEvents.has(eventId);
  }

  /**
   * Mark a webhook event ID as processed
   */
  public markEventProcessed(eventId: string, eventType: string): void {
    if (!eventId) return;
    this.processedEvents.set(eventId, {
      eventId,
      eventType,
      processedAt: new Date().toISOString(),
    });
  }

  /**
   * Grant subscription credits & activate paid plan (Rule 11)
   */
  public activatePaidSubscription(userEmail: string, planSlug: string): UserSubscriptionRecord {
    const cleanEmail = userEmail.trim().toLowerCase();
    
    let allowance = 3;
    switch (planSlug.toLowerCase()) {
      case 'starter':
        allowance = 50;
        break;
      case 'pro':
        allowance = 200;
        break;
      case 'agency':
        allowance = 600;
        break;
      default:
        allowance = 3;
    }

    const record: UserSubscriptionRecord = {
      userEmail: cleanEmail,
      planSlug,
      creditsRemaining: allowance,
      monthlyAllowance: allowance,
      isPaidUser: planSlug !== 'free',
      updatedAt: new Date().toISOString(),
    };

    this.subscriptions.set(cleanEmail, record);
    return record;
  }

  /**
   * Get subscription status for user
   */
  public getSubscription(userEmail: string): UserSubscriptionRecord | undefined {
    const cleanEmail = userEmail.trim().toLowerCase();
    return this.subscriptions.get(cleanEmail);
  }
}

export const BillingStore = new ServerBillingLedger();
