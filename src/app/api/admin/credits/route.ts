import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminEmail, targetEmail, amount, reason } = body;

    // Verify calling user is Admin Master
    if (adminEmail?.toLowerCase() !== 'olianilucas454@gmail.com') {
      return NextResponse.json({ error: 'Acesso negado: apenas administradores podem alterar créditos.' }, { status: 403 });
    }

    if (!targetEmail || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Parâmetros targetEmail e amount são obrigatórios.' }, { status: 400 });
    }

    console.log(`[Admin Adjustment] Admin ${adminEmail} adjusted ${amount} credits for ${targetEmail}. Reason: ${reason || 'Ajuste manual'}`);

    return NextResponse.json({
      success: true,
      type: 'ADMIN_ADJUSTMENT',
      targetEmail,
      amount,
      reason: reason || 'Ajuste manual administrativo',
      adjustedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Falha ao realizar ajuste de créditos' }, { status: 500 });
  }
}
