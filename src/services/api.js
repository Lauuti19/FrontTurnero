// services/api.js
const API_URL = 'https://backturnero-vvk6.onrender.com/api';

export const fetchWithAuth = async (endpoint, token, options = {}) => {
  const currentPath = window.location.pathname;

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

    // Si la API devuelve 401 o 403 → sesión expirada
    if (response.status === 401 || response.status === 403) {
      if (currentPath !== '/Expired') {
        window.location.href = '/Expired';
      }
      throw new Error('Sesión expirada');
    }

    // Si el fetch devuelve otro error
    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      } catch (e) {}
      throw new Error(errorMessage);
    }

    // Intentamos parsear la respuesta
    try {
      const data = await response.json();
      return data;
    } catch (jsonError) {
      return await response.text();
    }

  } catch (error) {
    console.error('Error en fetchWithAuth:', error);

    // Si el token no existe o el request falló por auth
    if (!token || error.message.includes('expirada')) {
      if (currentPath !== '/Expired') {
        window.location.href = '/Expired';
      }
    }

    throw error; // Importante para que el componente sepa que falló
  }
};

export const fetchJson = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error("Error en fetchJson:", err);
    throw err;
  }
};
