// services/auth.js
import { fetchWithAuth } from './api';
import { getFullUserData } from './userService';

const API_URL = 'https://backturnero-vvk6.onrender.com/api';

// Función auxiliar para hacer fetch básico (sin auth)
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Si no se puede parsear como JSON, usar texto plano
        try {
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        } catch (textError) {
          // Si tampoco se puede leer como texto, mantener el mensaje original
        }
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en fetchAPI (${endpoint}):`, error);
    throw error;
  }
};

// Servicio para registro
export const registerUser = async (userData) => {
  return await fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

// Servicio para login
export const loginUser = async (credentials) => {
  return await fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

// Servicio para obtener perfil del usuario
export const getUserProfile = async (token) => {
  return await fetchWithAuth('/auth/perfil', token);
};

// Servicio para obtener usuario completo después del login
export const getCompleteUserAfterLogin = async (token, loginData) => {
  try {
    // Si el login devuelve datos de usuario, intentar obtener datos completos
    if (loginData.usuario && loginData.usuario.id) {
      const fullUserData = await getFullUserData(token, loginData.usuario.id);
      return {
        ...loginData.usuario,
        ...fullUserData
      };
    }
    
    // Si no hay ID, intentar obtener perfil
    const profile = await getUserProfile(token);
    return profile.usuario || loginData.usuario;
    
  } catch (error) {
    console.warn('No se pudieron obtener datos completos, usando datos básicos del login:', error);
    return loginData.usuario || loginData; // Fallback por si acaso
  }
};