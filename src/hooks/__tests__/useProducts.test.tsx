import { renderHook, act, waitFor } from "@testing-library/react";
import { useProducts } from "../useProducts";
import { productService } from "@/services/products";

jest.mock("@/services/products", () => ({
  productService: {
    list: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("useProducts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useProducts());

    expect(result.current.products).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should fetch products successfully", async () => {
    const mockProducts = [
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

    (productService.list as jest.Mock).mockImplementation((page, limit) => {
      return Promise.resolve({
        data: {
          products: mockProducts,
          total: 1,
        },
      });
    });

    const { result } = renderHook(() => useProducts());

    await act(async () => {
      await result.current.fetchAllProducts();
    });

    console.log({result})

    await waitFor(() => {
      expect(result.current.allProducts).toEqual(mockProducts);
    });
  });

  it("should handle search products", async () => {
    const { result } = renderHook(() => useProducts());

    act(() => {
      result.current.searchProducts("test");
    });

    expect(result.current.searchTerm).toBe("test");
  });

  it("should handle sort products", async () => {
    const { result } = renderHook(() => useProducts());

    act(() => {
      result.current.sortProducts("title");
    });

    expect(result.current.sortField).toBe("title");
  });
});
