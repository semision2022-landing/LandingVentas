import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { sendOrderConfirmationEmail } from '@/lib/resend'
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

    // Send confirmation emails
    try {
      await sendOrderConfirmationEmail({
        customerEmail,
        customerName,
        planName,
        planPrice,
        orderId: order.id,
      })
    } catch { /* email failure should not block order */ }

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
