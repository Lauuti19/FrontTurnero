import { useState, useCallback } from 'react';
import { productService } from '../services';

export const useProducts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  // Obtener todos los productos
  const getProducts = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      const result = await productService.getProducts(token);
      const productsList = result.productos || [];
      setProducts(productsList);
      setLoading(false);
      return productsList;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Crear nuevo producto
  const createProduct = useCallback(async (token, productData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await productService.createProduct(token, productData);
      setLoading(false);
      
      // Recargar la lista de productos
      await getProducts(token);
      
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [getProducts]);

  // Actualizar precio/costo de producto
  const updateProductPrice = useCallback(async (token, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await productService.updateProductPrice(token, updateData);
      setLoading(false);
      
      // Actualizar el producto en la lista local
      setProducts(prev => 
        prev.map(product => 
          product.id_producto === updateData.id_producto
            ? { 
                ...product, 
                precio: updateData.precio !== undefined ? updateData.precio : product.precio,
                costo: updateData.costo !== undefined ? updateData.costo : product.costo
              }
            : product
        )
      );
      
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Eliminar producto
  const deleteProduct = useCallback(async (token, productId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await productService.deleteProduct(token, productId);
      setLoading(false);
      
      // Eliminar el producto de la lista local
      setProducts(prev => prev.filter(product => product.id_producto !== productId));
      
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener producto por ID
  const getProductById = useCallback((productId) => {
    return products.find(product => product.id_producto === productId);
  }, [products]);

  // Obtener productos con stock bajo
  const getLowStockProducts = useCallback((threshold = 5) => {
    return products.filter(product => product.stock <= threshold);
  }, [products]);

  // Obtener productos con mejor margen de ganancia
  const getHighMarginProducts = useCallback(() => {
    return products
      .filter(product => product.precio && product.costo)
      .map(product => ({
        ...product,
        margin: product.precio - product.costo,
        marginPercentage: ((product.precio - product.costo) / product.costo) * 100
      }))
      .sort((a, b) => b.marginPercentage - a.marginPercentage);
  }, [products]);

  return {
    // Estados
    loading,
    error,
    products,
    
    // Acciones
    getProducts,
    createProduct,
    updateProductPrice,
    deleteProduct,
    
    // Utilidades
    getProductById,
    getLowStockProducts,
    getHighMarginProducts,
    clearError: () => setError(null),
  };
};