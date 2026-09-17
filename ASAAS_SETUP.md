# GUIA DE CONFIGURAÇÃO DO ASAAS GATEWAY — LEADFORGE

Este documento descreve como configurar o gateway de pagamentos **Asaas** no ambiente de **Sandbox** (testes) e como migrar para **Produção**.

---

## 1. Configuração do Asaas Sandbox (Ambiente de Testes)

1. Crie uma conta no ambiente de testes do Asaas: [https://sandbox.asaas.com](https://sandbox.asaas.com)
2. Acesse **Minha Conta** → **Integrações** → **Chaves de API**.
3. Clique em **Gerar nova Chave de API**.
4. Copie a chave gerada e adicione no seu arquivo `.env.local`:

```env
ASAAS_API_KEY=$aact_Y3... (sua chave do sandbox)
ASAAS_ENVIRONMENT=sandbox
ASAAS_WEBHOOK_TOKEN=seu_token_secreto_de_webhook
```

---

## 2. Configuração de Webhooks do Asaas

Para receber notificações de pagamento e aprovação automática de planos:

1. No painel do Asaas Sandbox, acesse **Minha Conta** → **Integrações** → **Webhooks**.
2. Clique em **Criar Webhook**.
3. Preencha as configurações:
   - **URL de Envio**: `https://seu-dominio.com/api/webhooks/asaas` (ou URL do ngrok/localtunnel durante o desenvolvimento local).
   - **Email de Notificação**: seu email de administrador.
   - **Versão da API**: v3.
   - **Token de Autenticação**: insira o mesmo valor definido em `ASAAS_WEBHOOK_TOKEN`.
4. Selecione os eventos:
   - `PAYMENT_CONFIRMED`
   - `PAYMENT_RECEIVED`
   - `PAYMENT_OVERDUE`
   - `SUBSCRIPTION_DELETED`
   - `SUBSCRIPTION_UPDATED`

---

## 3. Testando o Fluxo Completo de Assinatura

1. No LeadForge, acesse `/planos`.
2. Escolha o plano **Starter**, **Pro** ou **Agency**.
3. Clique em **Assinar**.
4. O sistema irá:
   - Criar o cliente no Asaas (`AsaasService.getOrCreateCustomer`).
   - Criar a assinatura recorrente (`AsaasService.createSubscription`).
   - Retornar o link do checkout/fatura Asaas.
5. Simule a aprovação do pagamento no painel Sandbox do Asaas em **Cobranças** → **Confirmar Recebimento**.
6. O webhook enviará o evento `PAYMENT_CONFIRMED` para `/api/webhooks/asaas`, liberando a franquia de pesquisas no Supabase.

---

## 4. Mudando para Produção

Quando estiver pronto para vender em produção:

1. Obtenha a API Key de Produção em [https://www.asaas.com](https://www.asaas.com).
2. Atualize as variáveis no servidor de hospedagem (Vercel / VPS):

```env
ASAAS_API_KEY=$aact_PROD_...
ASAAS_ENVIRONMENT=production
ASAAS_WEBHOOK_TOKEN=token_secreto_producao
```

---

## 5. Resumo das Variáveis de Ambiente (`.env.example`)

```env
# SUPABASE
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ASAAS GATEWAY
ASAAS_API_KEY=your-asaas-api-key
ASAAS_ENVIRONMENT=sandbox
ASAAS_WEBHOOK_TOKEN=your-webhook-token
```
