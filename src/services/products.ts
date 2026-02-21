import apiClient from './api';

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image_url: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInput {
  name: string;
  description?: string;
  category: string;
  price: number;
  image_url?: string;
}

export const productService = {

  async getAll(): Promise<Product[]> {
    try {
      const { data } = await apiClient.get('/products');
      return data?.data || [];
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
  },

  async create(product: ProductInput, file?: File): Promise<Product> {
    const formData = new FormData();

    formData.append('name', product.name);
    formData.append('description', product.description || '');
    formData.append('category', product.category);
    formData.append('price', String(product.price));

    if (file) {
      formData.append('file', file);
    }

    try {
      const { data } = await apiClient.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return data.data;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  },

  async update(
    id: string,
    product: Partial<ProductInput>,
    file?: File
  ): Promise<Product> {
    const formData = new FormData();

    if (product.name) formData.append('name', product.name);
    if (product.description) formData.append('description', product.description);
    if (product.category) formData.append('category', product.category);
    if (product.price !== undefined)
      formData.append('price', String(product.price));

    if (file) {
      formData.append('file', file);
    }

    try {
      const { data } = await apiClient.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return data.data;
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/products/${id}`);
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  },
};