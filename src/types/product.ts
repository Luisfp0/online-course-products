export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreateProductDTO {
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  thumbnail?: string;
  images?: string[];
}

export interface ProductsState {
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

export type UpdateProductDTO = Partial<CreateProductDTO>;
