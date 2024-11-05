import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Dashboard from "../page";
import { Product, ProductsState } from "@/types/product";
import * as productsHook from "@/hooks/useProducts";

jest.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage({
    src,
    alt,
    className,
    priority,
    width,
    height,
  }: any) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
      />
    );
  },
}));

const mockProducts: Product[] = [
  {
    id: 1,
    title: "Test Product",
    description: "Test Description",
    price: 99.99,
    brand: "Test Brand",
    category: "Test Category",
    thumbnail: "test.jpg",
    images: ["test.jpg"],
  },
];

const mockProductsState: ProductsState = {
  products: [],
  filteredProducts: [],
  allProducts: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  searchTerm: "",
  sortField: null,
  isModalOpen: false,
  selectedProduct: null,
  totalItems: 0,
  fetchAllProducts: jest.fn().mockImplementation(() => Promise.resolve()),
  searchProducts: jest.fn(),
  sortProducts: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
  setModalOpen: jest.fn(),
  setSelectedProduct: jest.fn(),
  applyFilters: jest.fn(),
  changePage: jest.fn(),
};

jest.mock("@/hooks/useProducts", () => ({
  __esModule: true,
  ...jest.requireActual("@/hooks/useProducts"),
  useProducts: jest.fn().mockImplementation(() => ({
    ...mockProductsState,
    fetchAllProducts: jest.fn().mockImplementation(() => Promise.resolve()),
  })),
}));

jest.mock("@/hooks/useAuth", () => ({
  useAuth: jest.fn(() => ({
    loading: false,
  })),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Dashboard", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const renderDashboard = async () => {
    let rendered;
    await act(async () => {
      rendered = render(<Dashboard />);
    });
    return rendered;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(productsHook, "useProducts").mockImplementation(() => ({
      ...mockProductsState,
      filteredProducts: mockProducts,
      fetchAllProducts: jest.fn().mockImplementation(() => Promise.resolve()),
    }));
    (useRouter as jest.Mock).mockImplementation(() => mockRouter);
    (useAuth as jest.Mock).mockImplementation(() => ({
      loading: false,
    }));
  });

  it("should render dashboard with products", async () => {
    await renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });
  });

  it("should show loader when auth is loading", async () => {
    (useAuth as jest.Mock).mockImplementation(() => ({
      loading: true,
    }));

    await renderDashboard();

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("should show error message when there is an error", async () => {
    jest.spyOn(productsHook, "useProducts").mockImplementation(() => ({
      ...mockProductsState,
      error: "Test error",
      loading: false,
      filteredProducts: [],
    }));

    await renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/erro: test error/i)).toBeInTheDocument();
    });
  });

  it("should handle logout correctly", async () => {
    const user = userEvent.setup();

    await renderDashboard();

    await act(async () => {
      const logoutButton = screen.getByRole("button", { name: /logout/i });
      await user.click(logoutButton);
    });

    expect(localStorage.removeItem).toHaveBeenCalledWith("isAuthenticated");
    expect(mockRouter.push).toHaveBeenCalledWith("/");
  });

  it("should handle product editing", async () => {
    const user = userEvent.setup();
    const setSelectedProduct = jest.fn();
    const setModalOpen = jest.fn();

    jest.spyOn(productsHook, "useProducts").mockImplementation(() => ({
      ...mockProductsState,
      filteredProducts: mockProducts,
      setSelectedProduct,
      setModalOpen,
      isInitialLoading: false,
    }));

    await renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });

    await act(async () => {
      const editButton = screen.getByTestId("edit-button");
      await user.click(editButton);
    });

    expect(setSelectedProduct).toHaveBeenCalledWith(mockProducts[0]);
    expect(setModalOpen).toHaveBeenCalledWith(true);
  });

  it("should handle product deletion", async () => {
    const user = userEvent.setup();
    const deleteProduct = jest.fn();

    jest.spyOn(productsHook, "useProducts").mockImplementation(() => ({
      ...mockProductsState,
      filteredProducts: mockProducts,
      deleteProduct,
      isInitialLoading: false,
    }));

    window.confirm = jest.fn(() => true);

    await renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });

    await act(async () => {
      const deleteButton = screen.getByTestId("delete-button");
      await user.click(deleteButton);
    });

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete this product?"
    );
    expect(deleteProduct).toHaveBeenCalledWith(mockProducts[0].id);
  });

  it("should open modal for new product", async () => {
    const user = userEvent.setup();
    const setModalOpen = jest.fn();

    jest.spyOn(productsHook, "useProducts").mockImplementation(() => ({
      ...mockProductsState,
      filteredProducts: mockProducts,
      setModalOpen,
    }));

    await renderDashboard();

    await act(async () => {
      const newProductButton = screen.getByRole("button", {
        name: /new product/i,
      });
      await user.click(newProductButton);
    });

    expect(setModalOpen).toHaveBeenCalledWith(true);
  });
});
