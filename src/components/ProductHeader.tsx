"use client";

import { useCallback, useState } from "react";
import debounce from "lodash/debounce";

interface ProductHeaderProps {
  onSearch: (term: string) => void;
  onSort: (field: 'title' | 'brand') => void;
  searchTerm: string;
  onNewProduct: () => void;
}


export function ProductHeader({
  onSearch,
  onSort,
  searchTerm = "",
  onNewProduct
}: ProductHeaderProps) {
  const [inputValue, setInputValue] = useState(searchTerm);

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      onSearch(term);
    }, 300),
    [onSearch]
  );

  const handleSearch = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <button
          onClick={onNewProduct}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Novo Produto
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
        <input
          type="text"
          value={inputValue}
          placeholder="Buscar por título ou marca..."
          className="px-4 py-2 border rounded w-full md:w-64"
          onChange={(e) => handleSearch(e.target.value)}
        />

        <select
          className="px-4 py-2 border rounded w-full md:w-auto"
          onChange={(e) => onSort(e.target.value as "title" | "brand")}
        >
          <option value="">Ordenar por...</option>
          <option value="title">Título</option>
          <option value="brand">Marca</option>
        </select>
      </div>
    </div>
  );
}
