import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build')

const NOTIFICATION_EMAILS = [
  'valentinahurtado@emision.co',
  'direccioncomercial@emision.co',
  'martingonzalez@emision.co',
]

interface OrderEmailParams {
  customerEmail: string
  customerName: string
  planName: string
  planPrice: number
  orderId: string
}

function formatCOP(amount: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount)
}

export async function sendOrderConfirmationEmail(params: OrderEmailParams) {
  const { customerEmail, customerName, planName, planPrice, orderId } = params

  const html = `
    <div style="font-family: Poppins, sans-serif; max-width: 560px; margin: 0 auto; color: #18224C;">
      <div style="background: #18224C; padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: #00D0FF; font-size: 24px; margin: 0;">✈ e-Misión</h1>
        <p style="color: rgba(255,255,255,0.7); margin-top: 8px; font-size: 14px;">Documentos electrónicos avalados por la DIAN</p>
      </div>
      <div style="background: #f8fafc; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 20px; margin-bottom: 16px;">¡Gracias por tu compra, ${customerName}!</h2>
        <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
          Hemos recibido tu orden correctamente. Nuestro equipo se pondrá en contacto en las próximas horas para completar el proceso de habilitación.
        </p>
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 12px; color: #18224C;">Detalles de tu orden</h3>
          <table style="width: 100%; font-size: 13px; color: #64748b;">
            <tr><td style="padding: 4px 0;"><b style="color: #18224C;">Plan:</b></td><td style="text-align: right;">${planName}</td></tr>
            <tr><td style="padding: 4px 0;"><b style="color: #18224C;">Precio:</b></td><td style="text-align: right;">${formatCOP(planPrice)}/año</td></tr>
            <tr><td style="padding: 4px 0;"><b style="color: #18224C;">N° de orden:</b></td><td style="text-align: right; font-family: monospace;">${orderId.slice(0, 8).toUpperCase()}</td></tr>
          </table>
        </div>
        <p style="font-size: 13px; color: #64748b; line-height: 1.6;">
          ¿Tienes preguntas? Escríbenos al <a href="mailto:contacto@emision.co" style="color: #18224C; font-weight: 600;">contacto@emision.co</a> 
          o llámanos al <a href="tel:6045903572" style="color: #18224C; font-weight: 600;">604 590 3572</a>.
        </p>
        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8;">
          © 2026 e-Misión — Nodexum S.A.S. · Envigado, Antioquia
        </div>
      </div>
    </div>
  `

  const internalHtml = `
    <div style="font-family: sans-serif; max-width: 560px;">
      <h2 style="color: #18224C;">🛍 Nueva orden recibida</h2>
      <table style="font-size: 14px; color: #334155; width: 100%;">
        <tr><td><b>Cliente:</b></td><td>${customerName}</td></tr>
        <tr><td><b>Email:</b></td><td>${customerEmail}</td></tr>
        <tr><td><b>Plan:</b></td><td>${planName}</td></tr>
        <tr><td><b>Precio:</b></td><td>${formatCOP(planPrice)}/año</td></tr>
        <tr><td><b>N° de orden:</b></td><td><code>${orderId}</code></td></tr>
      </table>
    </div>
  `

  await Promise.all([
    // Customer confirmation
    resend.emails.send({
      from: 'e-Misión <noreply@emision.co>',
      to: customerEmail,
      subject: `✅ Confirmación de tu orden — ${planName}`,
      html,
    }),
    // Internal notification
    resend.emails.send({
      from: 'e-Misión Sistema <noreply@emision.co>',
      to: NOTIFICATION_EMAILS,
      subject: `🛍 Nueva orden: ${planName} — ${customerName}`,
      html: internalHtml,
    }),
  ])
}
