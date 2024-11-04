'use client';

import { useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { ProductHeader } from "@/components/ProductHeader";
import { Pagination } from "@/components/Pagination";
import { ProductModal } from "@/components/ProductModal";
import { Product, CreateProductDTO, UpdateProductDTO } from "@/types/product";

export default function Home() {
  const {
    filteredProducts,
    loading,
    error,
    fetchProducts,
    searchProducts,
    sortProducts,
    searchTerm,
    currentPage,
    totalPages,
    isModalOpen,
    selectedProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    setModalOpen,
    setSelectedProduct,
  } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSave = async (formData: CreateProductDTO) => {
    if (selectedProduct) {
      await updateProduct(selectedProduct.id, formData as UpdateProductDTO);
    } else {
      await createProduct(formData);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      await deleteProduct(id);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <ProductHeader
        onSearch={searchProducts}
        onSort={sortProducts}
        searchTerm={searchTerm}
        onNewProduct={() => {
          setSelectedProduct(null);
          setModalOpen(true);
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={fetchProducts}
      />

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedProduct(null);
        }}
        onSave={handleSave}
        product={selectedProduct || undefined}
      />
    </main>
  );
}