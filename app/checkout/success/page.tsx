import Header from '@/components/Header';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Header />
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-4xl font-bold text-gold mb-4">Order Confirmed!</h1>
          <p className="text-gray-300 mb-8">
            Thank you for your purchase. You will receive an email confirmation shortly.
          </p>
          <Link
            href="/"
            className="inline-block bg-gold text-black px-8 py-3 rounded-lg font-bold hover:bg-gold/90 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
