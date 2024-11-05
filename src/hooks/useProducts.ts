import { create } from "zustand";
import { CreateProductDTO, Product, UpdateProductDTO } from "@/types/product";
import { productService } from "@/services/products";

interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  allProducts: Product[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  searchTerm: string;
  sortField: "title" | "brand" | null;
  isModalOpen: boolean;
  selectedProduct: Product | null;
  totalItems: number;
  fetchAllProducts: () => Promise<void>;
  searchProducts: (term: string) => void;
  sortProducts: (field: "title" | "brand") => void;
  createProduct: (product: CreateProductDTO) => Promise<void>;
  updateProduct: (id: number, product: UpdateProductDTO) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  setModalOpen: (open: boolean) => void;
  setSelectedProduct: (product: Product | null) => void;
  applyFilters: () => void;
  changePage: (page: number) => void;
}

export const useProducts = create<ProductsState>((set, get) => ({
  products: [],
  filteredProducts: [],
  allProducts: [],
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  searchTerm: "",
  sortField: null,
  isModalOpen: false,
  selectedProduct: null,
  totalItems: 0,

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const initialResponse = await productService.list(1, 1);
      if (!initialResponse || !initialResponse.data) {
        throw new Error("Resposta inesperada da API");
      }
      const totalItems = initialResponse.data.total;

      const response = await productService.list(1, totalItems);
      if (!response || !response.data) {
        throw new Error("Resposta inesperada da API");
      }

      set({
        allProducts: response.data.products,
        totalItems,
        loading: false,
      });
      get().applyFilters();
    } catch (error: unknown) {
      console.error("Erro ao carregar produtos:", error);
      if (error instanceof Error) {
        set({
          error: error.message,
          loading: false,
        });
      } else {
        set({
          error: "Erro ao carregar produtos",
          loading: false,
        });
      }
    }
  },

  applyFilters: () => {
    const { allProducts, searchTerm, sortField, currentPage } = get();
    let filtered = [...allProducts];

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product?.title?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
          product?.brand?.toLowerCase()?.includes(searchTerm.toLowerCase())
      );
    }

    if (sortField) {
      filtered.sort((a, b) => {
        const aValue = a[sortField]?.toLowerCase() || "";
        const bValue = b[sortField]?.toLowerCase() || "";
        return aValue > bValue ? 1 : -1;
      });
    }

    const totalPages = Math.ceil(filtered.length / 9);

    const start = (currentPage - 1) * 9;
    const end = start + 9;
    const paginatedProducts = filtered.slice(start, end);

    set({
      filteredProducts: paginatedProducts,
      totalPages,
      products: paginatedProducts,
    });
  },

  searchProducts: (term: string) => {
    set({ searchTerm: term, currentPage: 1 });
    get().applyFilters();
  },

  sortProducts: (field: "title" | "brand") => {
    set({ sortField: field });
    get().applyFilters();
  },

  changePage: (page: number) => {
    set({ currentPage: page });
    get().applyFilters();
  },

  createProduct: async (product: CreateProductDTO) => {
    set({ loading: true, error: null });
    try {
      const response = await productService.create(product);
      if (response.data) {
        const { allProducts } = get();
        set({
          allProducts: [response.data, ...allProducts],
          error: null,
        });
        get().applyFilters();
      }
    } catch (error) {
      set({ error: "Erro ao criar produto. Por favor, tente novamente." });
    } finally {
      set({ loading: false, isModalOpen: false });
    }
  },

  updateProduct: async (id: number, product: UpdateProductDTO) => {
    set({ loading: true, error: null });
    try {
      const response = await productService.update(id, product);
      if (response.data) {
        const { allProducts } = get();
        const updatedProducts = allProducts.map((p) =>
          p.id === id
            ? {
                ...p,
                ...response.data,
                id,
                thumbnail: p.thumbnail,
              }
            : p
        );
        set({
          allProducts: updatedProducts,
          error: null,
        });
        get().applyFilters();
      }
    } catch (error) {
      set({ error: "Erro ao atualizar produto. Por favor, tente novamente." });
    } finally {
      set({ loading: false, isModalOpen: false, selectedProduct: null });
    }
  },

  deleteProduct: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await productService.delete(id);
      const { allProducts } = get();
      const filteredProducts = allProducts.filter((p) => p.id !== id);

      set({
        allProducts: filteredProducts,
        error: null,
      });

      get().applyFilters();
    } catch (error) {
      const { allProducts } = get();
      const filteredProducts = allProducts.filter((p) => p.id !== id);

      set({
        allProducts: filteredProducts,
      });

      get().applyFilters();
    } finally {
      set({ loading: false });
    }
  },

  setModalOpen: (open) => set({ isModalOpen: open }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
}));
