import { fetchWithAuth } from './api';

export const getFullUserData = async (token, userId) => {
  let perfilData = {};
  let userData = {};

  // 1️⃣ Intentar obtener datos del perfil (nombre, email, rol)
  try {
    const perfil = await fetchWithAuth('/auth/perfil', token);
    if (perfil.usuario) perfilData = perfil.usuario;
  } catch (e) {
    console.warn('No se pudo obtener perfil:', e.message);
  }

  // 2️⃣ Intentar obtener datos del usuario (dni, celular, etc.)
  try {
    const usuario = await fetchWithAuth(`/usuarios/${userId}`, token);
    userData = usuario.datos_usuario || usuario;
  } catch (e) {
    console.warn('No se pudo obtener datos de usuario:', e.message);
  }

  // 3️⃣ Combinar ambos (perfil tiene prioridad si hay conflictos)
  return {
    id_usuario: perfilData.id || userData.id || userId,
    nombre: perfilData.nombre || userData.nombre || '',
    email: perfilData.email || userData.email || '',
    dni: userData.dni || '',
    celular: userData.celular || '',
    id_rol: perfilData.id_rol || userData.id_rol || 3,
  };
};
