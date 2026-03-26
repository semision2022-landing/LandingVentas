const PAYZEN_SHOP_ID = process.env.PAYZEN_SHOP_ID!
const PAYZEN_KEY = process.env.PAYZEN_PRODUCTION_KEY || process.env.PAYZEN_TEST_KEY!
const PAYZEN_BASE_URL = 'https://api.payzen.lat/api-payment/V4'

// Clave pública (diferente a la contraseña) — necesaria para el formulario embebido
const PAYZEN_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYZEN_PUBLIC_KEY ?? ''

interface CreateOrderParams {
  orderId: string
  amount: number
  customerEmail: string
  customerName: string
  planName: string
}

interface PayZenOrderResult {
  transactionId: string | null
  redirectUrl: string | null
  formToken: string | null
}

export async function createPayZenOrder(params: CreateOrderParams): Promise<PayZenOrderResult> {
  const { orderId, amount, customerEmail, customerName, planName } = params

  const payload = {
    amount: amount * 100, // PayZen espera el valor en centavos (COP × 100)
    currency: 'COP',
    orderId,
    customer: {
      email: customerEmail,
      reference: customerEmail,
      billingDetails: { firstName: customerName.split(' ')[0], lastName: customerName.split(' ').slice(1).join(' ') || customerName },
    },
    metadata: { planName },
    ipnTargetUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://landing.emision.co'}/api/webhooks/payzen`,
  }

  const auth = Buffer.from(`${PAYZEN_SHOP_ID}:${PAYZEN_KEY}`).toString('base64')

  const res = await fetch(`${PAYZEN_BASE_URL}/Charge/CreatePayment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PayZen error: ${err}`)
  }

  const data = await res.json()

  if (data.status === 'ERROR') {
    throw new Error(`PayZen error: ${data.answer?.errorMessage ?? 'Unknown error'}`)
  }

  const formToken = data.answer?.formToken ?? null

  // Construir la URL de la página de pago hospedada de PayZen con el formToken
  let redirectUrl: string | null = null
  if (formToken && PAYZEN_PUBLIC_KEY) {
    redirectUrl = `https://secure.payzen.lat/payment/index?kr-public-key=${encodeURIComponent(PAYZEN_PUBLIC_KEY)}&kr-form-token=${encodeURIComponent(formToken)}`
  }

  return {
    transactionId: data.answer?.transactions?.[0]?.uuid ?? null,
    redirectUrl,
    formToken,
  }
}
