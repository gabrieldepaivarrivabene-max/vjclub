import Link from 'next/link';
import { Product } from '@/types';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-gray-900 rounded-lg overflow-hidden hover:border-gold border-2 border-transparent transition-all duration-300 group">
        <div className="aspect-square relative overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
          <p className="text-gold font-bold text-xl">R$ {product.price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
}
