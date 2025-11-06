// services/authService.js
const API_URL = 'https://backturnero-vvk6.onrender.com/api';

// Función básica de fetch para login (sin token)
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
      const error = new Error(`Error ${res.status}: ${res.statusText}`);
      error.status = res.status;
      throw error;
    }
    return await res.json();
  } catch (err) {
    console.error("Error en fetchJson:", err);
    throw err;
  }
};