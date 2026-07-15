import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.EMAIL_FROM as string;
const adminEmail = process.env.ADMIN_EMAIL as string;

// ... (mantén sendContactEmail como está)

interface OrderConfirmationData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  iva: number;
  descuento: number;
  descuentoPorcentaje: number;
  total: number;
  transactionId: string;
  direccion: string;
  ciudad: string;
  estado: string;
  cp: string;
  telefono: string;
  locale?: string;
}

const orderEmailTemplates = {
  es: {
    adminSubject: (orderId: string, customerName: string) => `🛒 Nueva Orden: ${orderId} - ${customerName}`,
    userSubject: (orderId: string) => `✅ Confirmación de compra - ${orderId}`,
    userTitle: '¡Compra Exitosa!',
    userThanks: (name: string) => `Gracias por tu compra, ${name}.`,
    orderDetails: 'Detalles del Pedido',
    shippingAddress: 'Dirección de envío',
    products: 'Productos',
    subtotal: 'Subtotal',
    iva: 'IVA (16%)',
    discount: 'Descuento',
    total: 'Total pagado',
    questions: 'Si tienes alguna pregunta sobre tu pedido, contáctanos en',
    regards: 'Saludos cordiales,',
    team: 'El equipo de Bitrixa',
    newOrder: 'Nueva Orden Recibida',
    client: 'Cliente',
    phone: 'Teléfono',
    address: 'Dirección',
  },
  en: {
    adminSubject: (orderId: string, customerName: string) => `🛒 New Order: ${orderId} - ${customerName}`,
    userSubject: (orderId: string) => `✅ Order Confirmation - ${orderId}`,
    userTitle: 'Purchase Successful!',
    userThanks: (name: string) => `Thank you for your purchase, ${name}.`,
    orderDetails: 'Order Details',
    shippingAddress: 'Shipping Address',
    products: 'Products',
    subtotal: 'Subtotal',
    iva: 'VAT (16%)',
    discount: 'Discount',
    total: 'Total Paid',
    questions: 'If you have any questions about your order, contact us at',
    regards: 'Best regards,',
    team: 'The Bitrixa Team',
    newOrder: 'New Order Received',
    client: 'Client',
    phone: 'Phone',
    address: 'Address',
  },
};

export async function sendOrderConfirmation(data: OrderConfirmationData) {
  const lang = data.locale === 'en' ? 'en' : 'es';
  const t = orderEmailTemplates[lang];

  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${(item.price * item.quantity).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
    </tr>`
    )
    .join('');

  const adminEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #f97316;">🛒 ${t.newOrder}</h1>
      <p><strong>Order ID:</strong> ${data.orderId}</p>
      <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
      <p><strong>${t.client}:</strong> ${data.customerName}</p>
      <p><strong>Email:</strong> ${data.customerEmail}</p>
      <p><strong>${t.phone}:</strong> ${data.telefono || 'No proporcionado'}</p>
      <p><strong>${t.address}:</strong> ${data.direccion}, ${data.ciudad}, ${data.estado}, CP ${data.cp}</p>
      
      <h2 style="color: #374151;">${t.products}</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 8px; text-align: left;">${t.products}</th>
            <th style="padding: 8px; text-align: center;">Cantidad</th>
            <th style="padding: 8px; text-align: right;">Precio Unit.</th>
            <th style="padding: 8px; text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="margin-top: 20px; text-align: right;">
        <p><strong>${t.subtotal}:</strong> $${data.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
        <p><strong>${t.iva}:</strong> $${data.iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
        ${data.descuento > 0 ? `<p style="color: #16a34a;"><strong>${t.discount} (${data.descuentoPorcentaje}%):</strong> -$${data.descuento.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>` : ''}
        <p style="font-size: 18px; color: #f97316;"><strong>${t.total}:</strong> $${data.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
      </div>
      <p style="color: #6b7280; font-size: 12px;">Idioma: ${lang === 'es' ? 'Español' : 'English'}</p>
    </div>
  `;

  const userEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #f97316;">✅ ${t.userTitle}</h1>
        <p style="font-size: 18px; color: #374151;">${t.userThanks(data.customerName)}</p>
      </div>

      <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #374151; margin-top: 0;">${t.orderDetails}</h2>
        <p><strong>Order ID:</strong> ${data.orderId}</p>
        <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
        <p><strong>${t.shippingAddress}:</strong> ${data.direccion}, ${data.ciudad}, ${data.estado}, CP ${data.cp}</p>
      </div>

      <h2 style="color: #374151;">${t.products}</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 8px; text-align: left;">${t.products}</th>
            <th style="padding: 8px; text-align: center;">Cantidad</th>
            <th style="padding: 8px; text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="text-align: right; margin-bottom: 30px; padding: 20px; background-color: #f9fafb; border-radius: 12px;">
        <p><strong>${t.subtotal}:</strong> $${data.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
        <p><strong>${t.iva}:</strong> $${data.iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
        ${data.descuento > 0 ? `<p style="color: #16a34a;"><strong>${t.discount} (${data.descuentoPorcentaje}%):</strong> -$${data.descuento.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>` : ''}
        <p style="font-size: 20px; color: #f97316;"><strong>${t.total}:</strong> $${data.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
      </div>

      <p style="text-align: center; color: #6b7280;">
        ${t.questions} <a href="mailto:informacion@bitrixa.com.mx" style="color: #f97316;">informacion@bitrixa.com.mx</a>
      </p>
      <p style="text-align: center; color: #374151; margin-top: 30px;">
        ${t.regards}<br/>
        <strong>${t.team}</strong>
      </p>
    </div>
  `;

  try {
    await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: t.adminSubject(data.orderId, data.customerName),
        html: adminEmailHtml,
      }),
      resend.emails.send({
        from: fromEmail,
        to: data.customerEmail,
        subject: t.userSubject(data.orderId),
        html: userEmailHtml,
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error('Error al enviar correos de confirmación:', error);
    return { success: false, error };
  }
}