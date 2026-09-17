import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const apiKey = process.env.ASAAS_API_KEY || '';
  const environment = process.env.ASAAS_ENVIRONMENT || 'sandbox';

  const baseUrl = environment === 'production'
    ? 'https://api.asaas.com/v3'
    : 'https://api-sandbox.asaas.com/v3';

  if (!apiKey) {
    return NextResponse.json({
      success: false,
      provider: 'asaas',
      environment,
      configured: false,
      connected: false,
      message: 'ASAAS_API_KEY não está configurada nas variáveis de ambiente server-side.',
    });
  }

  try {
    const response = await fetch(`${baseUrl}/customers?limit=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey,
      },
    });

    if (response.ok) {
      return NextResponse.json({
        success: true,
        provider: 'asaas',
        environment,
        baseUrl,
        configured: true,
        connected: true,
        message: `Conexão com a API do Asaas ${environment.toUpperCase()} estabelecida com sucesso!`,
      });
    }

    if (response.status === 401 || response.status === 403) {
      return NextResponse.json({
        success: false,
        provider: 'asaas',
        environment,
        baseUrl,
        configured: true,
        connected: false,
        message: 'Falha na autenticação do Asaas. Verifique se a ASAAS_API_KEY é válida para o ambiente configurado.',
      });
    }

    return NextResponse.json({
      success: false,
      provider: 'asaas',
      environment,
      baseUrl,
      configured: true,
      connected: false,
      message: `API do Asaas retornou status HTTP ${response.status}.`,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      provider: 'asaas',
      environment,
      baseUrl,
      configured: true,
      connected: false,
      message: 'Serviço da API do Asaas indisponível ou erro de rede.',
    });
  }
}
