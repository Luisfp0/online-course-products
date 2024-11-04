"use client";

import { useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { ProductHeader } from "@/components/ProductHeader";
import { Pagination } from "@/components/Pagination";
import { ProductModal } from "@/components/ProductModal";
import { Product, CreateProductDTO, UpdateProductDTO } from "@/types/product";
import { Loader } from "@/components/Loader";

export default function Home() {
  const {
    filteredProducts,
    loading,
    error,
    fetchAllProducts,
    searchProducts,
    sortProducts,
    searchTerm,
    currentPage,
    totalPages,
    isModalOpen,
    changePage,
    selectedProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    setModalOpen,
    setSelectedProduct,
  } = useProducts();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

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
    return <Loader />;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductHeader
        onSearch={searchProducts}
        onSort={sortProducts}
        searchTerm={searchTerm}
        onNewProduct={() => setModalOpen(true)}
      />

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          onPageChange={changePage}
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
    </div>
  );
}
