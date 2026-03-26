import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { createWooCommerceOrder } from '@/lib/woocommerce'

// Called by the frontend after Krypton confirms payment success
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Get the order from Supabase
    const { data: order, error: dbError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (dbError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Update order status to paid
    await supabase
      .from('orders')
      .update({ payment_status: 'paid' })
      .eq('id', orderId)

    // Create order in WooCommerce if product ID exists
    if (order.wc_product_id) {
      try {
        const wcOrder = await createWooCommerceOrder({
          productId: order.wc_product_id,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          customerPhone: order.customer_phone,
          customerCompany: order.customer_company,
          customerNit: order.customer_nit,
          planPrice: order.plan_price,
        })
        console.log(`[WC Sync] Order created in WooCommerce — WC ID: ${wcOrder.id} for ${order.customer_email}`)
        
        return NextResponse.json({ success: true, wcOrderId: wcOrder.id })
      } catch (wcErr) {
        console.error('[WC Sync Error]', wcErr)
        return NextResponse.json({ error: 'Payment recorded but WooCommerce sync failed' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error completing order'
    console.error('[Complete Order Error]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
