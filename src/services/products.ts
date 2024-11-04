import { api } from './api';
import { Product, ProductsResponse } from '@/types/product';

export const productService = {
  list: async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;
    return api.get<ProductsResponse>(`/products?limit=${limit}&skip=${skip}`);
  },

  getById: async (id: number) => {
    return api.get<Product>(`/products/${id}`);
  },

  create: async (product: Omit<Product, 'id'>) => {
    return api.post<Product>('/products/add', product);
  },

  update: async (id: number, product: Partial<Product>) => {
    return api.put<Product>(`/products/${id}`, product);
  },

  delete: async (id: number) => {
    return api.delete<Product>(`/products/${id}`);
  }
};