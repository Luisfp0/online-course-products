import { Product } from "@/types/product";
import Image from "next/image";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = "https://placehold.co/400x300";

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-xl flex flex-col min-h-[320px]">
      <div className="relative h-[150px] w-full overflow-hidden">
        <Image
          src={imageError ? fallbackImage : product.thumbnail}
          alt={product.title}
          fill
          style={{
            objectFit: "cover",
          }}
          className="transition-transform hover:scale-105"
          onError={() => setImageError(true)}
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        />
        {product.price && (
          <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full">
            <span className="text-green-600 font-semibold">
              ${product.price.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col justify-between flex-grow">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
            {product.title || <span className="invisible">Placeholder</span>}
          </h3>
          <p className="text-sm text-gray-600">
            {product.brand || <span className="invisible">Placeholder</span>}
          </p>
          <p className="text-sm text-gray-600">
            {product.category || <span className="invisible">Placeholder</span>}
          </p>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 overflow-hidden">
          {product.description || (
            <span className="invisible">Placeholder</span>
          )}
        </p>

        <div className="pt-2 flex justify-end space-x-2">
          <button
            onClick={() => onEdit(product)}
            className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
          >
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
}
