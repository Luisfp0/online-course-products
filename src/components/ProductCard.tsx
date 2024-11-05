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
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-xl flex flex-col min-h-[650px] sm:min-h-[550px] md:min-h-[650px] w-full">
      <div className="relative h-2/3 w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={imageError ? fallbackImage : product.thumbnail}
            alt={product.title}
            className="transition-transform hover:scale-105 object-cover  w-full h-full"
            onError={() => setImageError(true)}
            priority={true}
            width={500}
            height={500}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        </div>
        {product.price && (
          <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full shadow-sm">
            <span className="text-green-600 font-semibold text-sm sm:text-base">
              ${product.price.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 flex flex-col justify-between flex-grow">
        <div className="space-y-1 sm:space-y-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-1">
            {product.title || <span className="invisible">Placeholder</span>}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-xs sm:text-sm text-gray-600">
            <p className="line-clamp-1">
              {product.brand || <span className="invisible"></span>}
            </p>
            <span className="hidden sm:block">•</span>
            <p className="line-clamp-1">
              {product.category || (
                <span className="invisible">Placeholder</span>
              )}
            </p>
          </div>
        </div>

        <p className="text-gray-600 text-xs sm:text-sm mt-2 sm:mt-3 line-clamp-2 overflow-hidden">
          {product.description || (
            <span className="invisible">Placeholder</span>
          )}
        </p>

        <div className="pt-3 sm:pt-4 flex justify-end gap-2 sm:gap-3">
          <button
            data-testid="edit-button"
            onClick={() => onEdit(product)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md sm:rounded-lg transition-colors duration-200"
          >
            Edit
          </button>
          <button
            data-testid="delete-button"
            onClick={() => onDelete(product.id)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-md sm:rounded-lg transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
