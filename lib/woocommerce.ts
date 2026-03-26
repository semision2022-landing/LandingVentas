export interface WCProduct {
  id: number
  name: string
  price: number
}

export async function getWooCommerceProducts(): Promise<WCProduct[]> {
  const url = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wc/v3/products?per_page=100`
  const key = process.env.WC_CONSUMER_KEY
  const secret = process.env.WC_CONSUMER_SECRET

  if (!url || !key || !secret) {
    console.warn('WooCommerce keys are missing. Fetching products will be skipped.')
    return []
  }

  const auth = Buffer.from(`${key}:${secret}`).toString('base64')

  try {
    // Usamos revalidate para traer precios actualizados sin bombardear la API en cada visita
    const res = await fetch(url, {
      headers: { Authorization: `Basic ${auth}` },
      next: { revalidate: 60 } // caché de 60 segundos
    })

    if (!res.ok) {
      console.error('Failed to fetch WooCommerce products', await res.text())
      return []
    }

    const products = await res.json()
    return products.map((p: { id: number; name: string; price: string }) => ({
      id: p.id,
      name: p.name,
      price: parseInt(p.price || '0', 10),
    }))
  } catch (err) {
    console.error('Error connecting to WooCommerce:', err)
    return []
  }
}

export interface WCOrderParams {
  productId: number
  customerName: string
  customerEmail: string
  customerPhone: string
  customerCompany?: string
  customerNit: string
  planPrice: number
}

export async function createWooCommerceOrder(params: WCOrderParams) {
  const baseUrl = process.env.NEXT_PUBLIC_WP_URL
  const key = process.env.WC_CONSUMER_KEY
  const secret = process.env.WC_CONSUMER_SECRET

  if (!baseUrl || !key || !secret) {
    throw new Error('WooCommerce keys are missing. Cannot create order.')
  }

  const auth = Buffer.from(`${key}:${secret}`).toString('base64')
  const headers = {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json'
  }

  const [firstName, ...lastNames] = params.customerName.split(' ')
  const lastName = lastNames.length > 0 ? lastNames.join(' ') : params.customerName

  // Step 1: Find or create customer in WooCommerce (so WordPress creates a user account)
  let customerId = 0
  try {
    // Search for existing customer by email
    const searchRes = await fetch(
      `${baseUrl}/wp-json/wc/v3/customers?email=${encodeURIComponent(params.customerEmail)}`,
      { headers }
    )
    const customers = await searchRes.json()

    if (Array.isArray(customers) && customers.length > 0) {
      customerId = customers[0].id
      console.log(`[WC] Found existing customer ID: ${customerId}`)
    } else {
      // Create a new customer — WooCommerce will generate a password and send the "new account" email
      const createRes = await fetch(`${baseUrl}/wp-json/wc/v3/customers`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email: params.customerEmail,
          first_name: firstName,
          last_name: lastName,
          username: params.customerEmail.split('@')[0] + '_' + Date.now().toString(36),
          billing: {
            first_name: firstName,
            last_name: lastName,
            company: params.customerCompany || '',
            email: params.customerEmail,
            phone: params.customerPhone,
            address_1: `NIT: ${params.customerNit}`,
            country: 'CO'
          }
        })
      })

      if (createRes.ok) {
        const newCustomer = await createRes.json()
        customerId = newCustomer.id
        console.log(`[WC] Created new customer ID: ${customerId} — account email sent to ${params.customerEmail}`)
      } else {
        console.error('[WC] Could not create customer:', await createRes.text())
      }
    }
  } catch (err) {
    console.error('[WC] Error finding/creating customer:', err)
  }

  // Step 2: Create the order associated with the customer
  const orderData: Record<string, unknown> = {
    payment_method: 'payzen',
    payment_method_title: 'PayZen (Landing Page)',
    set_paid: true,
    status: 'completed',
    customer_id: customerId,
    billing: {
      first_name: firstName,
      last_name: lastName,
      company: params.customerCompany || '',
      email: params.customerEmail,
      phone: params.customerPhone,
      address_1: `NIT: ${params.customerNit}`,
      country: 'CO'
    },
    line_items: [
      {
        product_id: params.productId,
        quantity: 1,
        total: String(params.planPrice)
      }
    ],
    customer_note: `Orden creada desde la Landing Page. NIT del cliente: ${params.customerNit}`
  }

  const res = await fetch(`${baseUrl}/wp-json/wc/v3/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(orderData)
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error('Failed to create WooCommerce order:', errorText)
    throw new Error(`Failed to create WooCommerce order: ${res.statusText}`)
  }

  return await res.json()
}

