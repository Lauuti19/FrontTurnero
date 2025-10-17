// services/api.js
const API_URL = 'https://backturnero-vvk6.onrender.com/api';

export const fetchWithAuth = async (endpoint, token, options = {}) => {
  const defaultOptions = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      } catch (e) {
        // Si no se puede leer el texto de error, usar el mensaje por defecto
      }
      throw new Error(errorMessage);
    }

    // Intentar parsear como JSON
    try {
      const data = await response.json();
      return data;
    } catch (jsonError) {
      // Si no es JSON, devolver texto
      return await response.text();
    }
  } catch (error) {
    console.error('Error en fetchWithAuth:', error);
    throw error;
  }
};