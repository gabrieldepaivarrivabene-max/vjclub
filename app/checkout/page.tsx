'use client';
import { useEffect, useState } from 'react';
import { useCart } from '@/components/CartProvider';
import Header from '@/components/Header';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!);

export default function CheckoutPage() {
  const { cart: items, getTotal, clearCart } = useCart();
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [customer, setCustomer] = useState({ name: '', email: '', address: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const createPreference = async () => {
      if (customer.email && items.length > 0) {
        setLoading(true);
        try {
          const res = await fetch('/api/mercadopago/create-preference', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: items.map(item => ({ 
                name: item.product.name, 
                price: item.product.price, 
                quantity: item.quantity 
              })),
              customerEmail: customer.email,
              customerName: customer.name,
            }),
          });
          const { preferenceId } = await res.json();
          setPreferenceId(preferenceId);
        } catch (error) {
          console.error('Error creating preference:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    createPreference();
  }, [customer.email, items]);

  const handlePaymentSuccess = async () => {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer,
        cart: items,
        total: getTotal(),
        paymentId: preferenceId,
        status: 'approved',
      }),
    });
    clearCart();
    window.location.href = '/checkout/success';
  };

  if (items.length === 0) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-400">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-3xl text-gold mb-6">Checkout</h1>

        <div className="space-y-6">
          <div className="bg-gray-900 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold">Customer Information</h2>
            <input
              type="text"
              placeholder="Full name"
              className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-gold outline-none"
              onChange={e => setCustomer({ ...customer, name: e.target.value })}
              value={customer.name}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-gold outline-none"
              onChange={e => setCustomer({ ...customer, email: e.target.value })}
              value={customer.email}
            />
            <input
              type="text"
              placeholder="Shipping address"
              className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-gold outline-none"
              onChange={e => setCustomer({ ...customer, address: e.target.value })}
              value={customer.address}
            />
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.product.name} (Size: {item.variant.size}) x {item.quantity}</span>
                  <span>R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-gold border-t border-gray-700 pt-2">
                <span>Total</span>
                <span>R$ {getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-400">Loading payment options...</p>
          ) : preferenceId ? (
            <div className="bg-gray-900 rounded-lg p-6">
              <Wallet initialization={{ preferenceId }} onReady={() => console.log('Wallet ready')} />
            </div>
          ) : (
            <p className="text-center text-gray-400">Enter your email to see payment options</p>
          )}
        </div>
      </div>
    </div>
  );
}
