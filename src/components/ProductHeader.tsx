"use client";

import { ChevronDown } from "lucide-react";
interface ProductHeaderProps {
  onSearch: (term: string) => void;
  onSort: (field: "title" | "brand") => void;
  searchTerm: string;
  onNewProduct: () => void;
}

export function ProductHeader({
  onSearch,
  onSort,
  searchTerm,
  onNewProduct,
}: ProductHeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Produtos</h1>
            <button
              onClick={onNewProduct}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium"
            >
              Novo Produto
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-80">
              <input
                type="text"
                placeholder="Buscar por título ou marca..."
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700 placeholder-gray-500 bg-white shadow-sm"
              />
            </div>

            <div className="relative inline-block min-w-[180px]">
              <select
                onChange={(e) => onSort(e.target.value as "title" | "brand")}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-700 shadow-sm cursor-pointer appearance-none"
              >
                <option value="">Ordenar por</option>
                <option value="title">Título</option>
                <option value="brand">Marca</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
