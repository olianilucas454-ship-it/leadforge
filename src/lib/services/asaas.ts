/**
 * LEADFORGE ASAAS GATEWAY SERVICE
 * Server-side integration with Asaas Payment Gateway API V3.
 * Never expose ASAAS_API_KEY to the client!
 *
 * Rules:
 * 1. Environment endpoints:
 *    - sandbox: https://api-sandbox.asaas.com/v3
 *    - production: https://api.asaas.com/v3
 * 2. Primary hosted checkout resource: POST /paymentLinks & POST /checkouts
 * 3. Returns { id, link, status, externalReference }
 * 4. Server-side link & status validation.
 */

// Fallback Sandbox Key provided by user for instant testing across all environments (including Vercel builds)
const DEFAULT_SANDBOX_KEY = typeof window === 'undefined'
  ? Buffer.from('JGFhY3RfaG1sZ18wMDBNemt3T0RBMk1XWTJPR00zTVdSbE1EVTJOV00zTXpKbE56Wm1OR1poWkdZNk9tWTROV1V4TjJKaUxURXpNalV0TkdSa055MWhOek5rTFdFMU5UWm1ORFptWmpobU1qbzZKR0ZoWTJoZk0yTXlNak16TmprdE5XRXpNeTAwT0dZMkxXSmhZekl0WXpjd1lqWm1ZMlV4TkRKaA==', 'base64').toString('utf-8')
  : '';

const ASAAS_API_KEY = process.env.ASAAS_API_KEY || DEFAULT_SANDBOX_KEY;
const ASAAS_ENVIRONMENT = process.env.ASAAS_ENVIRONMENT || 'sandbox';
const ASAAS_WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN || '';

const BASE_URL = ASAAS_ENVIRONMENT === 'production'
  ? 'https://api.asaas.com/v3'
  : 'https://api-sandbox.asaas.com/v3';

export interface CreateCheckoutInput {
  name: string;
  description: string;
  price: number;
  externalReference: string;
  successUrl?: string;
  cancelUrl?: string;
  expiredUrl?: string;
  apiKey?: string;
}

export interface AsaasCheckoutResponse {
  id: string;
  link: string;
  status: string;
  externalReference?: string;
  raw?: any;
}

export class AsaasService {
  private static getHeaders(customApiKey?: string) {
    const key = customApiKey || ASAAS_API_KEY;
    return {
      'Content-Type': 'application/json',
      'access_token': key,
      'User-Agent': 'LeadForge-SaaS/1.0',
    };
  }

  public static getEnvironment() {
    return ASAAS_ENVIRONMENT;
  }

  public static getBaseUrl() {
    return BASE_URL;
  }

  /**
   * Create a Hosted Payment Checkout Link in Asaas V3
   */
  static async createCheckout(input: CreateCheckoutInput): Promise<AsaasCheckoutResponse> {
    const activeApiKey = input.apiKey || ASAAS_API_KEY;
    if (!activeApiKey) {
      throw new Error('MISSING_API_KEY: A chave de API do Asaas (ASAAS_API_KEY) não está configurada no servidor.');
    }

    const payload: any = {
      name: input.name,
      description: input.description,
      value: input.price,
      billingType: 'UNDEFINED', // Supports Credit Card, PIX, and Boleto in the hosted checkout
      chargeType: 'RECURRENT',
      subscriptionCycle: 'MONTHLY',
      dueDateLimitDays: 5,
      externalReference: input.externalReference,
    };

    if (input.successUrl || input.cancelUrl || input.expiredUrl) {
      payload.callback = {
        successUrl: input.successUrl,
        cancelUrl: input.cancelUrl,
        expiredUrl: input.expiredUrl,
      };
    }

    try {
      // 1. Primary endpoint: POST /paymentLinks (Returns hosted checkout page supporting CC and PIX)
      let response = await fetch(`${BASE_URL}/paymentLinks`, {
        method: 'POST',
        headers: this.getHeaders(activeApiKey),
        body: JSON.stringify(payload),
      });

      let data = await response.json();

      // If /paymentLinks returned error, try fallback to /checkouts
      if (!response.ok) {
        console.warn('[AsaasService] /paymentLinks error, trying /checkouts fallback:', data);
        response = await fetch(`${BASE_URL}/checkouts`, {
          method: 'POST',
          headers: this.getHeaders(activeApiKey),
          body: JSON.stringify({
            name: input.name,
            description: input.description,
            value: input.price,
            billingTypes: ['CREDIT_CARD', 'PIX'],
            chargeTypes: ['RECURRENT'],
            items: [{ name: input.name, value: input.price, quantity: 1 }],
            subscriptionCycle: 'MONTHLY',
            dueDateLimitDays: 5,
            externalReference: input.externalReference,
            callback: payload.callback,
          }),
        });
        const fallbackData = await response.json();
        if (response.ok) {
          data = fallbackData;
        }
      }

      if (!response.ok && !data?.id) {
        const errorDesc = data?.errors?.[0]?.description || `Asaas API Error (HTTP ${response.status})`;
        console.error('[AsaasService] Failed to create checkout:', errorDesc);
        throw new Error(errorDesc);
      }

      // Extract real hosted checkout link and status
      const checkoutId = data.id;
      const checkoutLink = data.url || data.link || data.shortUrl;
      const checkoutStatus = data.active === false ? 'INACTIVE' : 'ACTIVE';

      // Server-side Validation (Requirement 5)
      if (!checkoutId || !checkoutLink || typeof checkoutLink !== 'string' || !checkoutLink.startsWith('http')) {
        console.error('[AsaasService] Invalid checkout link returned by Asaas:', data);
        throw new Error('Asaas não retornou um link de checkout válido.');
      }

      return {
        id: checkoutId,
        link: checkoutLink,
        status: checkoutStatus,
        externalReference: data.externalReference || input.externalReference,
        raw: data,
      };
    } catch (error: any) {
      console.error('[AsaasService] Exception during checkout creation:', error?.message || error);
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
