import { Product } from "@/types/product";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={product.thumbnail}
          alt={product.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
        <p className="text-green-600 font-bold mb-2">
          ${product.price.toFixed(2)}
        </p>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between">
          <button
            onClick={() => onEdit(product)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}