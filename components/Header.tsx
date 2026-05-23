'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCart } from './CartProvider';
import Image from 'next/image';

export default function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { items } = useCart();
  const currentCategory = searchParams.get('category');
  const categories = [
    { name: 'Sneakers', slug: 'sneakers' },
    { name: 'Shirts', slug: 'shirts' },
    { name: 'Cleats', slug: 'cleats' },
  ];

  return (
    <header className="bg-black border-b border-gold/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 relative">
            <Image
              src="/logo.png"
              alt="VJ CLUB Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-2xl font-bold text-gold hidden sm:block">VJ CLUB</span>
        </Link>
        <nav className="flex gap-4 sm:gap-6 items-center">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/?category=${cat.slug}`}
              className={`hover:text-gold transition text-sm sm:text-base ${
                currentCategory === cat.slug ? 'text-gold border-b-2 border-gold' : 'text-white'
              }`}
            >
              {cat.name}
            </Link>
          ))}
          <Link href="/cart" className="text-white hover:text-gold relative">
            🛒
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {items.length}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
