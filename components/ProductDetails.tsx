'use client';
import { useState } from 'react';
import { useCart } from './CartProvider';
import SizeSelector from './SizeSelector';
import { Product, ProductVariant } from '@/types';

export default function ProductDetails({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const handleAddToCart = () => {
    if (selectedVariant) {
      addItem(product, selectedVariant);
      alert('Added to cart!');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full rounded-lg border border-gray-800"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gold">{product.name}</h1>
          <p className="text-gray-300 mt-4">{product.description}</p>
          <p className="text-2xl font-bold mt-4 text-gold">R$ {product.price.toFixed(2)}</p>
          
          <SizeSelector variants={product.product_variants || []} onSelect={setSelectedVariant} />
          
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant}
            className={`mt-6 w-full py-3 rounded-lg font-bold transition ${
              selectedVariant
                ? 'bg-gold text-black hover:bg-gold/90'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {selectedVariant ? 'Add to Cart' : 'Select a Size'}
          </button>
        </div>
      </div>
    </div>
  );
}
