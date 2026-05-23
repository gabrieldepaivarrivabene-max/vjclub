'use client';
import { useState } from 'react';
import { ProductVariant } from '@/types';

interface SizeSelectorProps {
  variants: ProductVariant[];
  onSelect: (variant: ProductVariant) => void;
}

export default function SizeSelector({ variants, onSelect }: SizeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<ProductVariant | null>(null);

  const handleSelect = (variant: ProductVariant) => {
    if (variant.stock > 0) {
      setSelectedSize(variant);
      onSelect(variant);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-white mb-2 font-semibold">Select Size</h3>
      <div className="flex gap-3 flex-wrap">
        {variants.map((variant) => {
          const isOutOfStock = variant.stock === 0;
          return (
            <button
              key={variant.id}
              onClick={() => handleSelect(variant)}
              disabled={isOutOfStock}
              className={`
                px-4 py-2 border rounded-md transition min-w-[60px]
                ${isOutOfStock 
                  ? 'line-through text-gray-500 border-gray-700 cursor-not-allowed bg-gray-800' 
                  : 'hover:border-gold text-white border-gray-700'
                }
                ${selectedSize?.id === variant.id ? 'border-gold bg-gold/20 text-gold' : ''}
              `}
            >
              {variant.size}
            </button>
          );
        })}
      </div>
      {selectedSize && (
        <p className="text-green-400 mt-2 text-sm">Size {selectedSize.size} selected - {selectedSize.stock} in stock</p>
      )}
    </div>
  );
}
