import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { createWooCommerceOrder } from '@/lib/woocommerce'

// PayZen webhook — update order status after payment confirmation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderId, transStatus, uuid } = body

    const supabase = createAdminClient()

    const paymentStatus =
      transStatus === 'AUTHORISED' ? 'paid' : transStatus === 'CANCELLED' ? 'cancelled' : 'failed'

    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update({
        payment_status: paymentStatus,
        payzen_transaction_id: uuid ?? null,
      })
      .eq('id', orderId)
      .select('*')
      .single()

    if (error) {
      console.error('Webhook Supabase Error:', error)
    }

    if (paymentStatus === 'paid' && updatedOrder?.wc_product_id) {
      try {
        await createWooCommerceOrder({
          productId: updatedOrder.wc_product_id,
          customerName: updatedOrder.customer_name,
          customerEmail: updatedOrder.customer_email,
          customerPhone: updatedOrder.customer_phone,
          customerCompany: updatedOrder.customer_company,
          customerNit: updatedOrder.customer_nit,
          planPrice: updatedOrder.plan_price,
        })
        console.log(`[WC Sync] Successfully sent order to WooCommerce for ${updatedOrder.customer_email}`)
      } catch (wcErr) {
        console.error('[WC Sync Error]', wcErr)
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
