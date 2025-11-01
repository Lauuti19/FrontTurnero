// services/userService.js
import { fetchWithAuth, fetchJson } from "./api";

export const searchByName = async (token, nombre = "") => {
  const q = encodeURIComponent(nombre || "");
  const data = await fetchWithAuth(`/usuarios/buscar?nombre=${q}`, token);
  return Array.isArray(data) ? data : data.usuarios || [];
};

export const getProfesAndAdmins = async () => {
  // tu backend: GET /api/usuarios/profes-admins/buscar
  const data = await fetchJson(`/usuarios/profes-admins/buscar`);

  // puede venir como array, o como [[rows]] si viene de CALL
  if (Array.isArray(data)) {
    if (Array.isArray(data[0])) {
      return data[0];
    }
    return data;
  }
  return data.usuarios || [];
};

export const getFullUserData = async (token, userId) => {
  let perfilData = {};
  let userData = {};

  // 1) Perfil
  try {
    const perfil = await fetchWithAuth("/auth/perfil", token);
    if (perfil?.usuario) perfilData = perfil.usuario;
  } catch (e) {
    console.warn("No se pudo obtener perfil:", e?.message);
  }

  // 2) Resolver id si no vino por parámetro
  const resolvedId =
    userId ??
    perfilData.id_usuario ??
    perfilData.id ??
    null;

  // 3) Datos del usuario por id
  if (resolvedId) {
    try {
      const usuario = await fetchWithAuth(`/usuarios/${resolvedId}`, token);
      userData = usuario?.datos_usuario || usuario || {};
    } catch (e) {
      console.warn("No se pudo obtener datos de usuario:", e?.message);
    }
  }

  // 4) Merge
  const idFinal =
    perfilData.id_usuario ??
    perfilData.id ??
    userData.id_usuario ??
    userData.id ??
    resolvedId;

  return {
    id_usuario: idFinal ?? null,
    nombre: perfilData.nombre ?? userData.nombre ?? "",
    email: perfilData.email ?? userData.email ?? "",
    dni: userData.dni ?? "",
    celular: userData.celular ?? "",
    id_rol: perfilData.id_rol ?? userData.id_rol ?? 3,
  };
};

export const userService = {
  searchByName,
  getProfesAndAdmins,
  getFullUserData,
};

export default userService;
