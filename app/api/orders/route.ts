import { createClient } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { customer, cart, total, paymentId, status } = await req.json();
    const supabase = createClient();

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: customer.name,
        customer_email: customer.email,
        shipping_address: customer.address,
        total_amount: total,
        payment_status: status,
        pagseguro_transaction_id: paymentId,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json({ error: orderError }, { status: 500 });
    }

    for (const item of cart) {
      await supabase.from('order_items').insert({
        order_id: order.id,
        product_id: item.product.id,
        variant_id: item.variant.id,
        quantity: item.quantity,
        price_at_time: item.product.price,
      });

      // Update stock
      await supabase
        .from('product_variants')
        .update({ stock: item.variant.stock - item.quantity })
        .eq('id', item.variant.id);
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
  }
}
