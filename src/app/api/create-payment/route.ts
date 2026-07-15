import { NextResponse } from 'next/server';
import { octanoLogin, tokenizarTarjeta, procesarPago } from '@/lib/octano';
import { sendOrderConfirmation } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, orderId, customerName, customerEmail, cardData, shippingData, items, descuentoAplicado, descuentoPorcentaje, locale } = body;

    console.log('💳 [PAGO] Iniciando proceso para orden:', orderId);
    console.log('🌐 [PAGO] Locale:', locale || 'es');

    // 1. Autenticar con Octano
    const token = await octanoLogin();
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Error de autenticación con el procesador de pagos' },
        { status: 500 }
      );
    }

    // 2. Tokenizar tarjeta
    let cardToken: string;
    let last4: string;

    if (token === 'simulated-token') {
      cardToken = `tok_sim_${Date.now()}`;
      last4 = cardData.numeroTarjeta.slice(-4);
      console.log('🔧 [MODO SIMULACIÓN] Token simulado:', cardToken);
    } else {
      const exp = cardData.fechaExpiracion.split('/');
      if (exp.length !== 2) {
        return NextResponse.json(
          { success: false, error: 'Formato de fecha de expiración inválido. Use MM/YY' },
          { status: 400 }
        );
      }

      const tokenizado = await tokenizarTarjeta(token, {
        number: cardData.numeroTarjeta.replace(/\s/g, ''),
        name: cardData.nombreTarjeta,
        month: exp[0].trim(),
        year: exp[1].trim(),
      });
      cardToken = tokenizado.token;
      last4 = tokenizado.last4;
      console.log('✅ Tarjeta tokenizada. Últimos 4 dígitos:', last4);
    }

    // 3. Procesar pago
    const resultado = await procesarPago(token, {
      amount: Math.round(amount * 100) / 100,
      orderId,
      customerName,
      customerEmail,
      cardToken,
      cvv: cardData.cvv || '000',
    });

    console.log('💰 Resultado del pago:', resultado.status);

    // 4. Enviar emails de confirmación si el pago fue aprobado
    if (resultado.success || resultado.status === 'approved') {
      const subtotal = items.reduce(
        (acc: number, item: any) => acc + item.price * item.quantity,
        0
      );
      const iva = subtotal * 0.16;
      const descuento = (subtotal * (descuentoPorcentaje || 0)) / 100;
      const total = subtotal + iva - descuento;

      try {
        await sendOrderConfirmation({
          orderId,
          customerName,
          customerEmail,
          items,
          subtotal,
          iva,
          descuento,
          descuentoPorcentaje: descuentoPorcentaje || 0,
          total,
          transactionId: resultado.transactionId || `TXN-${Date.now()}`,
          direccion: shippingData?.direccion || '',
          ciudad: shippingData?.ciudad || '',
          estado: shippingData?.estado || '',
          cp: shippingData?.cp || '',
          telefono: shippingData?.telefono || '',
          locale: locale || 'es',
        });
        console.log('📧 Emails de confirmación enviados en', locale === 'en' ? 'inglés' : 'español');
      } catch (emailError) {
        console.error('⚠️ Error enviando emails:', emailError);
      }
    }

    return NextResponse.json({
      success: resultado.success || resultado.status === 'approved',
      data: {
        ...resultado,
        last4,
        orderId,
        transactionId: resultado.transactionId || `TXN-${Date.now()}`,
      },
    });
  } catch (error: any) {
    console.error('❌ [PAGO] Error:', error.message);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}