/**
 * LEADFORGE ASAAS GATEWAY SERVICE
 * Server-side integration with Asaas Payment Gateway API V3.
 * Never expose ASAAS_API_KEY to the client!
 *
 * Rules:
 * 1. Environment endpoints:
 *    - sandbox: https://api-sandbox.asaas.com/v3
 *    - production: https://api.asaas.com/v3
 * 2. Primary resource: POST /checkouts
 * 3. Returns { id, link, status, externalReference }
 * 4. Server-side link & status validation.
 */

const ASAAS_API_KEY = process.env.ASAAS_API_KEY || '';
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
   * Create a Checkout in Asaas V3 (POST /checkouts)
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
      billingTypes: ['CREDIT_CARD', 'PIX', 'BOLETO'],
      chargeTypes: ['RECURRENT'],
      subscriptionCycle: 'MONTHLY',
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
      // 1. Try POST /checkouts
      let response = await fetch(`${BASE_URL}/checkouts`, {
        method: 'POST',
        headers: this.getHeaders(activeApiKey),
        body: JSON.stringify(payload),
      });

      let data = await response.json();

      // If /checkouts returned 404 or specific error, fallback to /paymentLinks
      if (!response.ok && (response.status === 404 || response.status === 405)) {
        console.warn('[AsaasService] /checkouts endpoint unavailable, falling back to /paymentLinks');
        response = await fetch(`${BASE_URL}/paymentLinks`, {
          method: 'POST',
          headers: this.getHeaders(activeApiKey),
          body: JSON.stringify({
            name: input.name,
            description: input.description,
            value: input.price,
            billingType: 'UNDEFINED',
            chargeType: 'RECURRENT',
            subscriptionCycle: 'MONTHLY',
            externalReference: input.externalReference,
            callback: payload.callback,
          }),
        });
        data = await response.json();
      }

      if (!response.ok) {
        const errorDesc = data?.errors?.[0]?.description || `Asaas API Error (HTTP ${response.status})`;
        console.error('[AsaasService] Failed to create checkout:', errorDesc);
        throw new Error(errorDesc);
      }

      // Extract link/url and status
      const checkoutId = data.id;
      const checkoutLink = data.link || data.url || data.shortUrl;
      const checkoutStatus = data.status || (checkoutLink ? 'ACTIVE' : 'INACTIVE');

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
