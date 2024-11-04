import { create } from 'zustand';
import { Product } from '@/types/product';
import { productService } from '@/services/products';

interface ProductsState {
  products: Product[];
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
      let products = response.data.products;
      
      const { searchTerm, sortField } = get();
      if (searchTerm) {
        products = products.filter(
          (product) =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (sortField) {
        products = [...products].sort((a, b) =>
          a[sortField].toLowerCase() > b[sortField].toLowerCase() ? 1 : -1
        );
      }
      
      set({
        products,
        totalPages: Math.ceil(response.data.total / 10),
        currentPage: page,
        error: null
      });
    } catch (error) {
      set({ error: 'Erro ao carregar produtos' });
    } finally {
      set({ loading: false });
    }
  },
  
  searchProducts: (term: string) => {
    set({ searchTerm: term });
    get().fetchProducts(1);
  },
  
  sortProducts: (field: 'title' | 'brand') => {
    set({ sortField: field });
    get().fetchProducts(get().currentPage);
  },
}));