import { api } from './api';
import { Product, ProductsResponse, CreateProductDTO, UpdateProductDTO } from '@/types/product';

export const productService = {
  list: async (page: number = 1, limit: number = 9) => {
    const skip = (page - 1) * limit;
    return api.get<ProductsResponse>(`/products?limit=${limit}&skip=${skip}`);
  },

  getById: async (id: number) => {
    return api.get<Product>(`/products/${id}`);
  },

  create: async (product: CreateProductDTO) => {
    return api.post<Product>('/products/add', {
      ...product,
      thumbnail: 'https://placeholder.com/150',
      images: []
    });
  },

  update: async (id: number, product: UpdateProductDTO) => {
    return api.put<Product>(`/products/${id}`, product);
  },

  delete: async (id: number) => {
    return api.delete<Product>(`/products/${id}`);
  }
};