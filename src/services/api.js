// services/api.js

// primero leo el .env
let API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

// si estoy desarrollando en mi máquina, fuerzo localhost
if (typeof window !== "undefined") {
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
  if (isLocalhost) {
    API_URL = "http://localhost:3001/api";
  }
}

console.log("👉 API_URL usada:", API_URL);

// función auxiliar: saca el token real
const normalizeToken = (token) => {
  if (!token) return null;
  if (typeof token === "string") return token.trim() || null;
  return token.token || token.accessToken || token.jwt || null;
};

export const fetchWithAuth = async (endpoint, token, options = {}) => {
  const realToken = normalizeToken(token);

  // asegurar que el endpoint tenga "/"
  const url =
    endpoint.startsWith("http://") || endpoint.startsWith("https://")
      ? endpoint
      : `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (realToken) {
    defaultHeaders.Authorization = `Bearer ${realToken}`;
  }

  const config = {
    ...options,
    headers: defaultHeaders,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const text = await response.text();
        if (text) {
          errorMessage = text;
        }
      } catch (e) {}
      throw new Error(errorMessage);
    }

    try {
      return await response.json();
    } catch {
      return await response.text();
    }
  } catch (error) {
    console.error("Error en fetchWithAuth:", error);
    throw error;
  }
};

export const fetchJson = async (endpoint, options = {}) => {
  const url =
    endpoint.startsWith("http://") || endpoint.startsWith("https://")
      ? endpoint
      : `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  };

  const resp = await fetch(url, config);

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(txt || `Error ${resp.status}`);
  }

  try {
    return await resp.json();
  } catch {
    return await resp.text();
  }
};
