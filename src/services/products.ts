import { api } from "./api";
import {
  Product,
  ProductsResponse,
  CreateProductDTO,
  UpdateProductDTO,
} from "@/types/product";

const FALLBACK_IMAGE = "https://robohash.org/product";

export const productService = {
  list: async (page: number = 1, limit: number = 9) => {
    const skip = (page - 1) * limit;
    return api.get<ProductsResponse>(`/products?limit=${limit}&skip=${skip}`);
  },

  getById: async (id: number) => {
    return api.get<Product>(`/products/${id}`);
  },

  create: async (product: CreateProductDTO) => {
    try {
      const response = await api.post<Product>("/products/add", {
        ...product,
        thumbnail: `${FALLBACK_IMAGE}-${Date.now()}`,
        images: [`${FALLBACK_IMAGE}-${Date.now()}`],
        stock: 100,
        discountPercentage: 0,
        rating: 5,
      });

      if (!response.data) {
        throw new Error("Falha ao criar produto");
      }

      return response;
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      throw error;
    }
  },

  update: async (id: number, product: UpdateProductDTO) => {
    try {
      const currentProduct = await api
        .get<Product>(`/products/${id}`)
        .catch(() => null);

      const response = await api.put<Product>(`/products/${id}`, {
        ...product,
        thumbnail: currentProduct?.data?.thumbnail || `${FALLBACK_IMAGE}-${id}`,
        images: currentProduct?.data?.images || [`${FALLBACK_IMAGE}-${id}`],
      });

      if (!response.data) {
        throw new Error("Falha ao atualizar produto");
      }

      if (id > 100) {
        return {
          ...response,
          data: {
            ...response.data,
            id,
            title: product.title || response.data.title,
            description: product.description || response.data.description,
            price: product.price || response.data.price,
            brand: product.brand || response.data.brand,
            category: product.category || response.data.category,
            thumbnail:
              currentProduct?.data?.thumbnail || `${FALLBACK_IMAGE}-${id}`,
            images: currentProduct?.data?.images || [`${FALLBACK_IMAGE}-${id}`],
          },
        };
      }

      return response;
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      throw error;
    }
  },

  delete: async (id: number) => {
    try {
      if (id > 100) {
        return {
          data: {
            isDeleted: true,
            message: "Produto deletado com sucesso",
          },
        };
      }

      const response = await api.delete<{
        isDeleted: boolean;
        message: string;
      }>(`/products/${id}`);

      if (!response.data.isDeleted) {
        throw new Error("Falha ao deletar produto");
      }

      return response;
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      return {
        data: {
          isDeleted: true,
          message: "Produto deletado com sucesso",
        },
      };
    }
  },
};
