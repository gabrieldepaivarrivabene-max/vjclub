import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(req: Request) {
  try {
    const { items, customerEmail, customerName } = await req.json();

    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });

    const preference = new Preference(client);

    const body = {
      items: items.map((item: any) => ({
        title: item.name,
        quantity: item.quantity,
        unit_price: Number(item.price),
        currency_id: 'BRL',
      })),
      payer: {
        name: customerName,
        email: customerEmail,
      },
      payment_methods: {
        installments: 12,
        excluded_payment_methods: [],
        excluded_payment_types: [],
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout`,
      },
      auto_return: 'approved',
    };

    const response = await preference.create({ body });
    return NextResponse.json({ preferenceId: response.id });
  } catch (error) {
    console.error('Error creating preference:', error);
    return NextResponse.json({ error: 'Error creating preference' }, { status: 500 });
  }
}
