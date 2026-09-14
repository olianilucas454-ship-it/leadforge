'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Search, ArrowRight, BarChart3, Users, Globe, Target, TrendingUp, Shield } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: Search,
      title: 'Busca Inteligente',
      description: 'Encontre empresas por nicho e localização com filtros avançados e dados reais.',
    },
    {
      icon: Globe,
      title: 'Análise de Website',
      description: 'Identifique automaticamente empresas sem site, com site ruim ou desatualizado.',
    },
    {
      icon: Target,
      title: 'Score de Oportunidade',
      description: 'Algoritmo que classifica leads de 0 a 100 pelo potencial de compra de um site.',
    },
    {
      icon: BarChart3,
      title: 'Dashboard Analítico',
      description: 'Métricas de prospecção, funil de conversão e análise por nicho em tempo real.',
    },
    {
      icon: Users,
      title: 'CRM Integrado',
      description: 'Pipeline Kanban completo para gerenciar todo o ciclo de vendas.',
    },
    {
      icon: TrendingUp,
      title: 'Inteligência Comercial',
      description: 'Mensagens de abordagem personalizadas geradas automaticamente para cada lead.',
    },
  ];

  const stats = [
    { value: '10.000+', label: 'Empresas analisadas' },
    { value: '94%', label: 'Precisão do score' },
    { value: '3x', label: 'Mais conversões' },
    { value: '< 30s', label: 'Por pesquisa' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <span className="text-lg font-bold">
              <span className="text-text-primary">LEAD</span>
              <span className="text-accent">FORGE</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/search')}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Entrar
            </button>
            <button
              onClick={() => router.push('/search')}
              className="h-9 px-4 bg-accent hover:bg-accent-hover text-black text-sm font-semibold rounded-lg transition-all"
            >
              Começar Grátis
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-medium mb-8">
            <Shield className="w-3.5 h-3.5" />
            Plataforma de Prospecção Inteligente
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary leading-tight mb-6">
            Encontre empresas que{' '}
            <span className="text-accent">precisam de um site</span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
            O LeadForge analisa milhares de negócios locais e identifica automaticamente
            quais têm maior potencial para comprar serviços de criação de sites.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push('/search')}
              className="h-14 px-8 bg-accent hover:bg-accent-hover text-black font-bold text-lg rounded-xl transition-all hover:scale-[1.02] flex items-center gap-3 w-full sm:w-auto justify-center"
            >
              Encontrar Leads
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push('/search')}
              className="h-14 px-8 bg-surface border border-border hover:border-border-hover text-text-primary font-medium text-lg rounded-xl transition-all w-full sm:w-auto"
            >
              Ver Demonstração
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent mb-1">{stat.value}</div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Tudo que você precisa para prospectar
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Uma plataforma completa de inteligência comercial focada em identificar
              oportunidades de venda de sites.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-surface border border-border rounded-xl hover:border-border-hover transition-all group"
              >
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-surface/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Como funciona
            </h2>
          </div>

          <div className="space-y-8">
            {[
              {
                step: '01',
                title: 'Escolha o nicho',
                description: 'Selecione o tipo de negócio: barbearias, restaurantes, clínicas, academias e muito mais.',
              },
              {
                step: '02',
                title: 'Defina a localização',
                description: 'Informe a cidade, estado e raio de busca para encontrar empresas próximas.',
              },
              {
                step: '03',
                title: 'Analise os resultados',
                description: 'O sistema analisa cada empresa, identifica quem não tem site e calcula o score de oportunidade.',
              },
              {
                step: '04',
                title: 'Prospecte com inteligência',
                description: 'Use as mensagens de abordagem personalizadas e gerencie tudo pelo CRM integrado.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-bold text-sm">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-1">{item.title}</h3>
                  <p className="text-text-secondary">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Comece a encontrar clientes agora
          </h2>
          <p className="text-text-secondary text-lg mb-10">
            Pare de perder tempo procurando clientes manualmente. Deixe o LeadForge
            encontrar as melhores oportunidades para você.
          </p>
          <button
            onClick={() => router.push('/search')}
            className="h-14 px-10 bg-accent hover:bg-accent-hover text-black font-bold text-lg rounded-xl transition-all hover:scale-[1.02] inline-flex items-center gap-3"
          >
            Começar Gratuitamente
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold">
              <span className="text-text-primary">LEAD</span>
              <span className="text-accent">FORGE</span>
            </span>
          </div>
          <p className="text-text-muted text-xs">
            © 2026 LeadForge. Prospecção inteligente para venda de sites.
          </p>
        </div>
      </footer>
    </div>
  );
}
