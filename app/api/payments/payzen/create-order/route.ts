import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { createPayZenOrder } from '@/lib/payzen'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerCompany,
      customerNit,
      planName,
      planPrice,
      productId,
    } = body

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !customerNit || !planName || !planPrice) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    // Save order in Supabase
    const supabase = createAdminClient()
    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        customer_company: customerCompany || null,
        customer_nit: customerNit,
        plan_name: planName,
        plan_price: planPrice,
        wc_product_id: productId || null,
        payment_status: 'pending',
      })
      .select('id')
      .single()

    if (dbError) throw new Error(`DB error: ${dbError.message}`)

    // Create PayZen order
    const payzenResult = await createPayZenOrder({
      orderId: order.id,
      amount: planPrice,
      customerEmail,
      customerName,
      planName,
    })

    // Update order with PayZen transaction ID
    if (payzenResult.transactionId) {
      await supabase
        .from('orders')
        .update({ payzen_transaction_id: payzenResult.transactionId })
        .eq('id', order.id)
    }

    // Save prospect in conversations table as hot lead (source: checkout)
    // so it shows up in the admin leads panel and gets assigned to a sales agent
    const leadId = crypto.randomUUID()
    await createAdminClient()
      .from('conversations')
      .insert({
        id: leadId,
        session_id: `checkout_${order.id}`,
        status: 'closed',
        visitor_name: customerName,
        visitor_email: customerEmail,
        visitor_phone: customerPhone,
        plan_interest: planName,
        lead_source: 'checkout',
        lead_source_type: 'checkout',
      })
      .then(({ error }) => { if (error) console.error('[create-order] lead insert:', error) })

    // Assign lead to next agent in round-robin (fire-and-forget)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://ventas.emision.co'
    fetch(`${baseUrl}/api/leads/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId: leadId, source: 'checkout' }),
    }).catch(() => {})

    return NextResponse.json({
      success: true,
      orderId: order.id,
      formToken: payzenResult.formToken,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al crear la orden'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
