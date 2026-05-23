import { createClient } from '@/lib/supabaseServer';
import Header from '@/components/Header';
import ChatWidget from '@/components/ChatWidget';
import ProductDetails from '@/components/ProductDetails';
import { Product } from '@/types';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: product } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('id', params.id)
    .single();

  if (!product) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p>Product not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Header />
      <ProductDetails product={product as Product} />
      <ChatWidget />
    </div>
  );
}
