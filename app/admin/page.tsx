'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Order, Product } from '@/types';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [ordersRes, productsRes] = await Promise.all([
      supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }),
      supabase.from('products').select('*, product_variants(*)').order('created_at', { ascending: false }),
    ]);
    setOrders(ordersRes.data || []);
    setProducts(productsRes.data || []);
  };

  const updateStock = async (variantId: string, newStock: number) => {
    await supabase.from('product_variants').update({ stock: newStock }).eq('id', variantId);
    fetchData();
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gold">Admin Dashboard</h1>
          <button
            onClick={() => {
              document.cookie = 'admin_token=; path=/; max-age=0';
              window.location.href = '/admin/login';
            }}
            className="text-gray-400 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded ${activeTab === 'orders' ? 'bg-gold text-black' : 'bg-gray-800'}`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2 rounded ${activeTab === 'products' ? 'bg-gold text-black' : 'bg-gray-800'}`}
          >
            Products
          </button>
        </div>

        {activeTab === 'orders' ? (
          <section>
            <h2 className="text-xl text-gold mb-4">Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gold">
                  <tr>
                    <th className="py-2">Order ID</th>
                    <th className="py-2">Customer</th>
                    <th className="py-2">Total</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-gray-800">
                      <td className="py-3">{order.id.slice(0, 8)}</td>
                      <td>
                        {order.customer_name}
                        <br />
                        <span className="text-sm text-gray-400">{order.customer_email}</span>
                      </td>
                      <td>R$ {order.total_amount}</td>
                      <td>
                        <span className={`px-2 py-1 rounded text-sm ${
                          order.payment_status === 'approved' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                        }`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="text-sm text-gray-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section>
            <h2 className="text-xl text-gold mb-4">Products & Stock</h2>
            <div className="space-y-4">
              {products.map(product => (
                <div key={product.id} className="bg-gray-900 border border-gray-800 p-4 rounded">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="text-gray-400 mb-4">R$ {product.price.toFixed(2)}</p>
                  <div className="space-y-2">
                    {product.product_variants?.map(variant => (
                      <div key={variant.id} className="flex items-center gap-4">
                        <span className="w-16">Size {variant.size}</span>
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) => updateStock(variant.id, parseInt(e.target.value))}
                          className="bg-gray-800 text-white px-3 py-2 rounded w-24 border border-gray-700"
                        />
                        <span className="text-gray-400">in stock</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
