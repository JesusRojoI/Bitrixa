import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.EMAIL_FROM as string;
const adminEmail = process.env.ADMIN_EMAIL as string;

// Plantillas de email por idioma
const emailTemplates = {
  es: {
    adminSubject: (name: string) => `Nuevo mensaje de contacto de ${name}`,
    adminTitle: 'Nuevo mensaje de Bitrixa',
    userSubject: (name: string) => `Hemos recibido tu consulta, ${name}`,
    userTitle: (name: string) => `Gracias por contactarnos, ${name}`,
    userMessage: 'Hemos recibido tu mensaje y nuestro equipo te responderá en breve.',
    summaryLabel: 'Resumen de tu mensaje:',
    regards: 'Saludos cordiales,',
    team: 'El equipo de Bitrixa',
    labels: {
      name: 'Nombre',
      phone: 'Teléfono',
      email: 'Email',
      message: 'Mensaje',
    },
  },
  en: {
    adminSubject: (name: string) => `New contact message from ${name}`,
    adminTitle: 'New Bitrixa Message',
    userSubject: (name: string) => `We have received your inquiry, ${name}`,
    userTitle: (name: string) => `Thank you for contacting us, ${name}`,
    userMessage: 'We have received your message and our team will respond shortly.',
    summaryLabel: 'Summary of your message:',
    regards: 'Best regards,',
    team: 'The Bitrixa Team',
    labels: {
      name: 'Name',
      phone: 'Phone',
      email: 'Email',
      message: 'Message',
    },
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, message, locale } = body;

    if (!name || !phone || !email || !message) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    // Seleccionar idioma (default: español)
    const lang = locale === 'en' ? 'en' : 'es';
    const t = emailTemplates[lang];

    // Email para el administrador (FWD)
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f97316;">${t.adminTitle}</h1>
        <p><strong>${t.labels.name}:</strong> ${name}</p>
        <p><strong>${t.labels.phone}:</strong> ${phone}</p>
        <p><strong>${t.labels.email}:</strong> ${email}</p>
        <p><strong>${t.labels.message}:</strong></p>
        <p style="background-color: #f3f4f6; padding: 15px; border-radius: 8px;">${message}</p>
        <p style="color: #6b7280; font-size: 12px;">Idioma: ${lang === 'es' ? 'Español' : 'English'}</p>
      </div>
    `;

    // Email de confirmación para el usuario
    const userHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #f97316;">${t.userTitle(name)}</h1>
          <p style="font-size: 16px; color: #374151;">${t.userMessage}</p>
        </div>
        
        <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #374151; margin-top: 0;">${t.summaryLabel}</h2>
          <p style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">${message}</p>
        </div>

        <p style="text-align: center; color: #6b7280; margin-top: 30px;">
          ${t.regards}<br/>
          <strong>${t.team}</strong>
        </p>
      </div>
    `;

    // Enviar ambos emails
    await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: t.adminSubject(name),
        html: adminHtml,
      }),
      resend.emails.send({
        from: fromEmail,
        to: email,
        subject: t.userSubject(name),
        html: userHtml,
      }),
    ]);

    return NextResponse.json(
      { message: 'Correos enviados exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al enviar correos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}