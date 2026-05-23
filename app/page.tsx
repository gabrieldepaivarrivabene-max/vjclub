import { createClient } from '@/lib/supabaseServer';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import ChatWidget from '@/components/ChatWidget';

export default async function Home({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const supabase = createClient();
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (searchParams.category) {
    query = query.eq('category', searchParams.category);
  }

  const { data: products } = await query;

  return (
    <main className="bg-black min-h-screen text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gold mb-8">
          {searchParams.category ? searchParams.category.charAt(0).toUpperCase() + searchParams.category.slice(1) : 'New Arrivals'}
        </h1>
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No products found.</p>
        )}
      </div>
      <ChatWidget />
    </main>
  );
}
