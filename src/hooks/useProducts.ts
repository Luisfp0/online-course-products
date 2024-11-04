import { create } from "zustand";
import { CreateProductDTO, Product, UpdateProductDTO } from "@/types/product";
import { productService } from "@/services/products";

interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  searchTerm: string;
  sortField: "title" | "brand" | "";
  isModalOpen: boolean;
  selectedProduct: Product | null;
  fetchProducts: (page?: number) => Promise<void>;
  searchProducts: (term: string) => void;
  sortProducts: (field: "title" | "brand") => void;
  createProduct: (product: CreateProductDTO) => Promise<void>;
  updateProduct: (id: number, product: UpdateProductDTO) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  setModalOpen: (open: boolean) => void;
  setSelectedProduct: (product: Product | null) => void;
}


export const useProducts = create<ProductsState>((set, get) => ({
  products: [],
  filteredProducts: [],
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  searchTerm: "",
  sortField: "",
  isModalOpen: false,
  selectedProduct: null,

  fetchProducts: async (page = 1) => {
    set({ loading: true });
    try {
      const response = await productService.list(page);
      const products = response.data.products;

      set((state) => {
        const filtered = filterAndSortProducts(
          products,
          state.searchTerm,
          state.sortField
        );
        return {
          products,
          filteredProducts: filtered,
          totalPages: Math.ceil(response.data.total / 10),
          currentPage: page,
          error: null,
          loading: false,
        };
      });
    } catch (error) {
      set({ error: "Erro ao carregar produtos", loading: false });
    }
  },

  searchProducts: (term: string) => {
    set((state) => {
      const filtered = filterAndSortProducts(
        state.products,
        term,
        state.sortField
      );
      return {
        searchTerm: term,
        filteredProducts: filtered,
      };
    });
  },

  sortProducts: (field: "title" | "brand") => {
    set((state) => {
      const filtered = filterAndSortProducts(
        state.products,
        state.searchTerm,
        field
      );
      return {
        sortField: field,
        filteredProducts: filtered,
      };
    });
  },

  createProduct: async (product: CreateProductDTO) => {
    set({ loading: true });
    try {
      await productService.create(product);
      await get().fetchProducts();
    } catch (error) {
      set({ error: "Erro ao criar produto" });
    } finally {
      set({ loading: false, isModalOpen: false });
    }
  },

  updateProduct: async (id: number, product: UpdateProductDTO) => {
    set({ loading: true });
    try {
      await productService.update(id, product);
      await get().fetchProducts();
    } catch (error) {
      set({ error: "Erro ao atualizar produto" });
    } finally {
      set({ loading: false, isModalOpen: false, selectedProduct: null });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await productService.delete(id);
      await get().fetchProducts();
    } catch (error) {
      set({ error: "Erro ao deletar produto" });
    } finally {
      set({ loading: false });
    }
  },

  setModalOpen: (open) => set({ isModalOpen: open }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
}));

function filterAndSortProducts(
  products: Product[],
  searchTerm: string,
  sortField: "title" | "brand" | ""
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
