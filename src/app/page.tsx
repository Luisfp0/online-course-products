"use client";

import { useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { ProductHeader } from "@/components/ProductHeader";

export default function Home() {
  const {
    products,
    loading,
    error,
    fetchProducts,
    searchProducts,
    sortProducts,
  } = useProducts();

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
      <ProductHeader onSearch={searchProducts} onSort={sortProducts} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={(product) => console.log("Edit:", product)}
            onDelete={(id) => console.log("Delete:", id)}
          />
        ))}
      </div>
    </main>
  );
}
