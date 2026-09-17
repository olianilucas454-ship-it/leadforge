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

interface CreatePaymentLinkInput {
  name: string;
  description: string;
  price: number;
  externalReference?: string;
}

export class AsaasService {
  private static getHeaders() {
    return {
      'Content-Type': 'application/json',
      'access_token': ASAAS_API_KEY,
      'User-Agent': 'LeadForge-SaaS/1.0',
    };
  }

  /**
   * Create a Hosted Payment Link in Asaas (Supports Credit Card, PIX, Boleto)
   */
  static async createPaymentLink(input: CreatePaymentLinkInput) {
    if (!ASAAS_API_KEY) {
      const mockId = `mock_${Date.now()}`;
      return {
        id: mockId,
        url: `https://sandbox.asaas.com/c/${mockId}`,
        name: input.name,
        value: input.price,
      };
    }

    try {
      const response = await fetch(`${BASE_URL}/paymentLinks`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          name: input.name,
          description: input.description,
          value: input.price,
          billingType: 'UNDEFINED',
          chargeType: 'RECURRENT',
          subscriptionCycle: 'MONTHLY',
          dueDateLimitDays: 5,
          externalReference: input.externalReference,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('[AsaasService] Create payment link failed:', data);
        throw new Error(data?.errors?.[0]?.description || 'Falha ao criar link de pagamento no Asaas');
      }

      return data;
    } catch (error: any) {
      console.error('[AsaasService] Create payment link exception:', error);
      throw error;
    }
  }

  /**
   * Verify Webhook Security Token
   */
  static verifyWebhookToken(token: string | null): boolean {
    if (!ASAAS_WEBHOOK_TOKEN) return true;
    return token === ASAAS_WEBHOOK_TOKEN;
  }
}
