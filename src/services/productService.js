import { fetchWithAuth } from './api';

export const productService = {
  /**
   * Obtener todos los productos
   */
  getProducts: async (token) => {
    return await fetchWithAuth('/products/list', token);
  },

  /**
   * Crear un nuevo producto
   */
  createProduct: async (token, productData) => {
    return await fetchWithAuth('/products/create', token, {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  /**
   * Actualizar precio y/o costo de producto
   */
  updateProductPrice: async (token, updateData) => {
    return await fetchWithAuth('/products/update-price', token, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  /**
   * Eliminar producto
   */
  deleteProduct: async (token, productId) => {
    return await fetchWithAuth(`/products/delete/${productId}`, token, {
      method: 'DELETE',
    });
  },
};