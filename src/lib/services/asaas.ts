/**
 * LEADFORGE ASAAS GATEWAY SERVICE
 * Server-side integration with Asaas Payment Gateway API.
 * Never expose ASAAS_API_KEY to the client!
 */

const ASAAS_API_KEY = process.env.ASAAS_API_KEY || '';
const ASAAS_ENVIRONMENT = process.env.ASAAS_ENVIRONMENT || 'sandbox';
const ASAAS_WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN || '';

const BASE_URL = ASAAS_ENVIRONMENT === 'production'
  ? 'https://www.asaas.com/api/v3'
  : 'https://sandbox.asaas.com/api/v3';

interface CreateCustomerInput {
  name: string;
  email: string;
  cpfCnpj?: string;
  phone?: string;
}

interface CreateSubscriptionInput {
  customerId: string;
  planSlug: 'starter' | 'pro' | 'agency';
  price: number;
  description: string;
  externalReference?: string;
}

export class AsaasService {
  private static getHeaders() {
    return {
      'Content-Type': 'application/json',
      'access_token': ASAAS_API_KEY,
    };
  }

  /**
   * Find an existing customer by email address
   */
  static async findCustomerByEmail(email: string) {
    if (!ASAAS_API_KEY) {
      console.warn('[AsaasService] ASAAS_API_KEY not configured. Running in mock mode.');
      return null;
    }

    try {
      const response = await fetch(`${BASE_URL}/customers?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Asaas API error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.data && data.data.length > 0) {
        return data.data[0];
      }
      return null;
    } catch (error) {
      console.error('[AsaasService] Error finding customer:', error);
      return null;
    }
  }

  /**
   * Create or retrieve a Customer in Asaas
   */
  static async getOrCreateCustomer(input: CreateCustomerInput) {
    // 1. Try finding existing customer first
    const existing = await this.findCustomerByEmail(input.email);
    if (existing) {
      return existing;
    }

    if (!ASAAS_API_KEY) {
      // Mock mode fallback when no key is set yet
      return {
        id: `cus_mock_${Date.now()}`,
        name: input.name,
        email: input.email,
        cpfCnpj: input.cpfCnpj || '00000000000',
      };
    }

    // 2. Create new customer
    try {
      const response = await fetch(`${BASE_URL}/customers`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          name: input.name,
          email: input.email,
          cpfCnpj: input.cpfCnpj || undefined,
          mobilePhone: input.phone || undefined,
          notificationDisabled: false,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('[AsaasService] Create customer failed:', data);
        throw new Error(data?.errors?.[0]?.description || 'Falha ao criar cliente no Asaas');
      }

      return data;
    } catch (error: any) {
      console.error('[AsaasService] Create customer exception:', error);
      throw error;
    }
  }

  /**
   * Create a Monthly Subscription in Asaas
   */
  static async createSubscription(input: CreateSubscriptionInput) {
    if (!ASAAS_API_KEY) {
      // Mock checkout response for sandbox preview
      const mockSubId = `sub_mock_${Date.now()}`;
      return {
        id: mockSubId,
        customer: input.customerId,
        value: input.price,
        nextDueDate: new Date(Date.now() + 30 * 86400 * 1000).toISOString().split('T')[0],
        cycle: 'MONTHLY',
        description: input.description,
        status: 'ACTIVE',
        invoiceUrl: `https://sandbox.asaas.com/i/mock_checkout_${mockSubId}`,
      };
    }

    try {
      const response = await fetch(`${BASE_URL}/subscriptions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          customer: input.customerId,
          billingType: 'UNDEFINED', // Allows customer to pick Credit Card, PIX, or Boleto
          value: input.price,
          nextDueDate: new Date(Date.now() + 86400 * 1000).toISOString().split('T')[0], // Tomorrow
          cycle: 'MONTHLY',
          description: input.description,
          externalReference: input.externalReference,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('[AsaasService] Create subscription failed:', data);
        throw new Error(data?.errors?.[0]?.description || 'Falha ao criar assinatura no Asaas');
      }

      return data;
    } catch (error: any) {
      console.error('[AsaasService] Create subscription exception:', error);
      throw error;
    }
  }

  /**
   * Cancel an active Subscription
   */
  static async cancelSubscription(subscriptionId: string) {
    if (!ASAAS_API_KEY || subscriptionId.startsWith('sub_mock_')) {
      return { id: subscriptionId, deleted: true, status: 'CANCELED' };
    }

    try {
      const response = await fetch(`${BASE_URL}/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('[AsaasService] Cancel subscription error:', error);
      throw error;
    }
  }

  /**
   * Verify Webhook Security Token
   */
  static verifyWebhookToken(token: string | null): boolean {
    if (!ASAAS_WEBHOOK_TOKEN) return true; // Accept in dev if token not configured
    return token === ASAAS_WEBHOOK_TOKEN;
  }
}
