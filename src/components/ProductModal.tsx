import { useState } from "react";
import { CreateProductDTO, Product } from "@/types/product";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: CreateProductDTO) => void;
  product?: Product;
}

export function ProductModal({
  isOpen,
  onClose,
  onSave,
  product,
}: ProductModalProps) {
  const [formData, setFormData] = useState({
    title: product?.title || "",
    description: product?.description || "",
    price: product?.price || 0,
    brand: product?.brand || "",
    category: product?.category || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300">
      <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 scale-100 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {product ? "Editar Produto" : "Novo Produto"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Título
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg text-black font-thin focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o título do produto"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg text-black font-thin focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descrição do produto"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Preço
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              className="w-full p-3 border border-gray-300 rounded-lg text-black font-thin focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Preço do produto"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Marca
            </label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg text-black font-thin focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Marca do produto"
              required
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-black font-thin hover:bg-gray-200 transition-colors duration-200 font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-black font-thin hover:bg-blue-700 transition-colors duration-200 font-semibold"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
