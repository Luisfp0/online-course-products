import { productService } from "../products";
import { api } from "../api";
import { Product } from "@/types/product";

jest.mock("../api", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("ProductService", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("list", () => {
    it("should list products with correct pagination", async () => {
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

      (api.get as jest.Mock).mockResolvedValueOnce({
        data: {
          products: mockProducts,
          total: 1,
          skip: 0,
          limit: 9,
        },
      });

      const result = await productService.list(1, 9);
      expect(result.data.products).toEqual(mockProducts);
      expect(api.get).toHaveBeenCalledWith("/products?limit=9&skip=0");
    });
  });

  describe("getById", () => {
    it("should get product by id", async () => {
      const mockProduct = {
        id: 1,
        title: "Test Product",
      };

      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockProduct });

      const result = await productService.getById(1);
      expect(result.data).toEqual(mockProduct);
      expect(api.get).toHaveBeenCalledWith("/products/1");
    });
  });

  describe("create", () => {
    it("should create product successfully", async () => {
      const newProduct = {
        title: "New Product",
        description: "Test Description",
        price: 99.99,
        brand: "Test Brand",
        category: "Test Category",
      };

      const mockResponse = {
        data: {
          ...newProduct,
          id: 1,
          thumbnail: expect.stringContaining("robohash.org"),
          images: [expect.stringContaining("robohash.org")],
        },
      };

      (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await productService.create(newProduct);
      expect(result.data).toMatchObject(mockResponse.data);
      expect(api.post).toHaveBeenCalledWith(
        "/products/add",
        expect.objectContaining({
          ...newProduct,
          stock: 100,
          discountPercentage: 0,
          rating: 5,
        })
      );
    });

    it("should throw error when create fails", async () => {
      const newProduct = {
        title: "New Product",
        description: "Test Description",
        price: 99.99,
        brand: "Test Brand",
        category: "Test Category",
      };

      (api.post as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

      await expect(productService.create(newProduct)).rejects.toThrow(
        "API Error"
      );
    });

    it("should throw error when response has no data", async () => {
      const newProduct = {
        title: "New Product",
        description: "Test Description",
        price: 99.99,
        brand: "Test Brand",
        category: "Test Category",
      };

      (api.post as jest.Mock).mockResolvedValueOnce({});

      await expect(productService.create(newProduct)).rejects.toThrow(
        "Falha ao criar produto"
      );
    });
  });

  describe("update", () => {
    it("should update existing product (id <= 100)", async () => {
      const mockCurrentProduct = {
        data: {
          id: 1,
          title: "Old Title",
          description: "Old Description",
          price: 10.0,
          brand: "Old Brand",
          category: "Old Category",
          thumbnail: "old.jpg",
          images: ["old.jpg"],
        },
      };

      const updateData = {
        title: "Updated Title",
      };

      (api.get as jest.Mock).mockResolvedValueOnce(mockCurrentProduct);
      (api.put as jest.Mock).mockResolvedValueOnce({
        data: { ...mockCurrentProduct.data, ...updateData },
      });

      const result = await productService.update(1, updateData);
      expect(result.data.title).toBe("Updated Title");
      expect(api.put).toHaveBeenCalledWith("/products/1", expect.any(Object));
    });

    it("should handle update for custom products (id > 100)", async () => {
      const mockCurrentProduct = {
        data: {
          id: 101,
          title: "Custom Product",
          description: "Description",
          price: 10.0,
          brand: "Brand",
          category: "Category",
          thumbnail: "custom.jpg",
          images: ["custom.jpg"],
        },
      };

      const updateData = {
        title: "Updated Custom",
      };

      (api.get as jest.Mock).mockResolvedValueOnce(mockCurrentProduct);
      (api.put as jest.Mock).mockResolvedValueOnce({
        data: { ...mockCurrentProduct.data, ...updateData },
      });

      const result = await productService.update(101, updateData);
      expect(result.data.id).toBe(101);
      expect(result.data.title).toBe("Updated Custom");
    });

    it("should handle update error", async () => {
      (api.get as jest.Mock).mockResolvedValueOnce({ data: { id: 1 } });
      (api.put as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

      await expect(
        productService.update(1, { title: "New Title" })
      ).rejects.toThrow("API Error");
    });
  });

  describe("delete", () => {
    it("should delete existing product (id <= 100)", async () => {
      (api.delete as jest.Mock).mockResolvedValueOnce({
        data: { isDeleted: true, message: "Success" },
      });

      const result = await productService.delete(1);
      expect(result.data.isDeleted).toBe(true);
      expect(api.delete).toHaveBeenCalledWith("/products/1");
    });

    it("should handle custom product deletion (id > 100)", async () => {
      const result = await productService.delete(101);
      expect(result.data.isDeleted).toBe(true);
      expect(result.data.message).toBe("Produto deletado com sucesso");
      expect(api.delete).not.toHaveBeenCalled();
    });

    it("should handle delete error gracefully", async () => {
      (api.delete as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

      const result = await productService.delete(1);
      expect(result.data.isDeleted).toBe(true);
      expect(result.data.message).toBe("Produto deletado com sucesso");
    });
  });
});