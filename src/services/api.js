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
      } catch (e) {}
      throw new Error(errorMessage);
    }

    try {
      const data = await response.json();
      return data;
    } catch (jsonError) {
      return await response.text();
    }
  } catch (error) {
    console.error('Error en fetchWithAuth:', error);
    throw error;
  }
};

// 🔹 NUEVO: para endpoints que NO necesitan token
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
