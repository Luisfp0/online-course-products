'use client';

import { useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/ProductCard';

export default function Home() {
  const { products, loading, error, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Novo Produto
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={(product) => console.log('Edit:', product)}
            onDelete={(id) => console.log('Delete:', id)}
          />
        ))}
      </div>
    </main>
  );
}