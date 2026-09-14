import { NextRequest, NextResponse } from 'next/server';
import { WebsiteAnalysis } from '@/lib/types/lead';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL inválida' }, { status: 400 });
    }

    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    const startTime = Date.now();
    const hasHttps = targetUrl.startsWith('https://');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const res = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) LeadForgeWebsiteAuditor/1.0',
          'Accept': 'text/html,application/xhtml+xml',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const latency = Date.now() - startTime;
      const html = await res.text();
      const lowerHtml = html.toLowerCase();

      // Mobile friendly check (meta viewport)
      const isMobileFriendly = lowerHtml.includes('name="viewport"') || lowerHtml.includes("name='viewport'");
      const mobileScore = isMobileFriendly ? 88 : 30;

      // Contact features
      const hasContactForm = lowerHtml.includes('<form') || lowerHtml.includes('type="email"');
      const hasWhatsApp = lowerHtml.includes('wa.me') || lowerHtml.includes('whatsapp') || lowerHtml.includes('api.whatsapp.com');
      const hasCTA = lowerHtml.includes('agend') || lowerHtml.includes('contat') || lowerHtml.includes('orcamento') || lowerHtml.includes('orçamento') || lowerHtml.includes('fale conosco');

      // SEO check
      const hasTitle = lowerHtml.includes('<title>') && !lowerHtml.includes('<title></title>');
      const hasDescription = lowerHtml.includes('name="description"') || lowerHtml.includes("name='description'");
      const seoScore = (hasTitle ? 40 : 0) + (hasDescription ? 40 : 10) + (hasHttps ? 20 : 0);

      // Performance score based on latency
      let performanceScore = 85;
      if (latency > 3000) performanceScore = 35;
      else if (latency > 1500) performanceScore = 55;
      else if (latency > 800) performanceScore = 75;

      // Design score based on HTML5 / modern standards
      const isHtml5 = lowerHtml.includes('<!doctype html>');
      const hasModernFramework = lowerHtml.includes('react') || lowerHtml.includes('next') || lowerHtml.includes('vue') || lowerHtml.includes('tailwind') || lowerHtml.includes('bootstrap');
      const designScore = (isHtml5 ? 40 : 20) + (hasModernFramework ? 40 : 20) + (isMobileFriendly ? 20 : 0);

      // Conversion score
      const conversionScore = (hasWhatsApp ? 35 : 0) + (hasContactForm ? 35 : 0) + (hasCTA ? 30 : 10);

      // Overall quality
      const overallQuality = Math.round(
        (mobileScore * 0.25) +
        (performanceScore * 0.25) +
        (designScore * 0.2) +
        (conversionScore * 0.2) +
        (seoScore * 0.1)
      );

      const issues: string[] = [];
      if (!hasHttps) issues.push('Site não utiliza certificado de segurança HTTPS');
      if (!isMobileFriendly) issues.push('Ausência de meta tag viewport para dispositivos móveis');
      if (performanceScore < 60) issues.push(`Tempo de carregamento elevado (${latency}ms)`);
      if (!hasWhatsApp) issues.push('Ausência de botão ou link direto para WhatsApp');
      if (!hasContactForm) issues.push('Não possui formulário de contato integrado');
      if (!hasDescription) issues.push('Meta tag description ausente (SEO básico)');

      const analysis: WebsiteAnalysis = {
        url: targetUrl,
        hasHttps,
        isMobileFriendly,
        mobileScore,
        performanceScore,
        designScore,
        conversionScore,
        seoScore,
        overallQuality,
        hasContactForm,
        hasWhatsApp,
        hasCTA,
        hasOwnDomain: !targetUrl.includes('wixsite.com') && !targetUrl.includes('wordpress.com') && !targetUrl.includes('blogspot.com'),
        issues,
      };

      return NextResponse.json(analysis);
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      // Website exists in registry but failed to load (broken site!)
      const brokenAnalysis: WebsiteAnalysis = {
        url: targetUrl,
        hasHttps: false,
        isMobileFriendly: false,
        mobileScore: 15,
        performanceScore: 10,
        designScore: 20,
        conversionScore: 10,
        seoScore: 20,
        overallQuality: 15,
        hasContactForm: false,
        hasWhatsApp: false,
        hasCTA: false,
        hasOwnDomain: true,
        issues: [
          'Website inacessível, fora do ar ou com erro de conexão',
          'Tempo limite de resposta excedido',
          'Oportunidade alta para oferecer novo site estável'
        ],
      };
      return NextResponse.json(brokenAnalysis);
    }
  } catch (err: any) {
    return NextResponse.json({ error: 'Erro ao analisar website', details: err?.message }, { status: 500 });
  }
}
