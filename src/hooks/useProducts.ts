import { create } from 'zustand';
import { Product } from '@/types/product';
import { productService } from '@/services/products';

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  fetchProducts: (page?: number) => Promise<void>;
}

export const useProducts = create<ProductsState>((set) => ({
  products: [],
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  fetchProducts: async (page = 1) => {
    set({ loading: true });
    try {
      const response = await productService.list(page);
      set({
        products: response.data.products,
        totalPages: Math.ceil(response.data.total / 10),
        currentPage: page,
        error: null
      });
    } catch (error) {
      set({ error: 'Erro ao carregar produtos' });
    } finally {
      set({ loading: false });
    }
  }
}));