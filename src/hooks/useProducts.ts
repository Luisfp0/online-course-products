import { create } from 'zustand';
import { Product } from '@/types/product';
import { productService } from '@/services/products';

interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  searchTerm: string;
  sortField: 'title' | 'brand' | '';
  fetchProducts: (page?: number) => Promise<void>;
  searchProducts: (term: string) => void;
  sortProducts: (field: 'title' | 'brand') => void;
}

export const useProducts = create<ProductsState>((set, get) => ({
  products: [],
  filteredProducts: [],
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  searchTerm: '',
  sortField: '',
  
  fetchProducts: async (page = 1) => {
    set({ loading: true });
    try {
      const response = await productService.list(page);
      const products = response.data.products;
      
      set((state) => {
        const filtered = filterAndSortProducts(products, state.searchTerm, state.sortField);
        return {
          products,
          filteredProducts: filtered,
          totalPages: Math.ceil(response.data.total / 10),
          currentPage: page,
          error: null,
          loading: false
        };
      });
    } catch (error) {
      set({ error: 'Erro ao carregar produtos', loading: false });
    }
  },
  
  searchProducts: (term: string) => {
    set((state) => {
      const filtered = filterAndSortProducts(state.products, term, state.sortField);
      return {
        searchTerm: term,
        filteredProducts: filtered
      };
    });
  },
  
  sortProducts: (field: 'title' | 'brand') => {
    set((state) => {
      const filtered = filterAndSortProducts(state.products, state.searchTerm, field);
      return {
        sortField: field,
        filteredProducts: filtered
      };
    });
  },
}));

function filterAndSortProducts(
  products: Product[], 
  searchTerm: string, 
  sortField: 'title' | 'brand' | ''
): Product[] {
  let filtered = [...products];
  
  if (searchTerm) {
    filtered = filtered.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  if (sortField) {
    filtered.sort((a, b) =>
      a[sortField].toLowerCase() > b[sortField].toLowerCase() ? 1 : -1
    );
  }
  
  return filtered;
}