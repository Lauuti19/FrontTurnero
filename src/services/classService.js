// services/classService.js
import { fetchWithAuth } from "./api";

// --- helpers ---
const q = (obj = {}) =>
  Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

// Normaliza: si viene array -> array; si viene otra cosa -> []
const normalizeArray = (data) => (Array.isArray(data) ? data : []);

// -------------------------------------------------------------------

/**
 * Service para clases: alinea con controllers/classesController.js
 * Rutas usadas:
 *  - GET  /classes/all?fecha
 *  - GET  /classes/by-user?userId&fecha
 *  - GET  /classes/by-user-no-credits?userId&fecha
 *  - GET  /classes/by-day?id_dia
 *  - GET  /classes/users-by-class?classId&classType&fecha
 *  - POST /classes/register
 *  - POST /classes/unregister
 *  - PUT  /classes/update-attendance
 *  - POST /classes/check
 *  - PUT  /classes/register-attendance
 */
export const classService = {
  /** Devuelve clases para una fecha (si hay especiales, el back devuelve esas). */
  getClasses: async (token, fecha) => {
    const endpoint = fecha ? `/classes/all?${q({ fecha })}` : "/classes/all";
    const data = await fetchWithAuth(endpoint, token);
    return normalizeArray(data);
  },

  /**
   * 🔎 Trae usuarios inscriptos a una clase (NORMAL o ESPECIAL) en una fecha.
   * REQUIERE: classId, classType ("normal" | "especial"), fecha
   * Controller: getUsersByClassAndDate
   */
  getClassUsers: async (token, { classId, classType, fecha }) => {
    if (!classId || !classType || !fecha) {
      throw new Error("classId, classType y fecha son obligatorios");
    }
    const endpoint = `/classes/users-by-class?${q({ classId, classType, fecha })}`;
    const data = await fetchWithAuth(endpoint, token);
    return normalizeArray(data);
  },

  /** Alias por compatibilidad: apunta a users-by-class (por defecto classType=normal). */
  getAttendeesByClass: async (token, { classId, fecha, classType = "normal" }) => {
    return await classService.getClassUsers(token, { classId, classType, fecha });
  },

  /**
   * Inscribir a clase (enviar SOLO UNO: classId (normal) o specialClassId (especial)).
   * Controller: registerToClass
   */
  registerUserToClass: async (token, { userId, fecha, classId, specialClassId }) => {
    if (!userId || !fecha) throw new Error("userId y fecha son obligatorios");
    if ((!classId && !specialClassId) || (classId && specialClassId)) {
      throw new Error("Enviá SOLO uno: classId (normal) o specialClassId (especial)");
    }
    return await fetchWithAuth("/classes/register", token, {
      method: "POST",
      body: JSON.stringify({ userId, fecha, classId, specialClassId }),
    });
  },

  /**
   * Desinscribir de clase (enviar SOLO UNO: classId o specialClassId).
   * Controller: unregisterFromClass
   */
  unregisterUserFromClass: async (token, { userId, fecha, classId, specialClassId }) => {
    if (!userId || !fecha) throw new Error("userId y fecha son obligatorios");
    if ((!classId && !specialClassId) || (classId && specialClassId)) {
      throw new Error("Enviá SOLO uno: classId (normal) o specialClassId (especial)");
    }
    return await fetchWithAuth("/classes/unregister", token, {
      method: "POST",
      body: JSON.stringify({ userId, fecha, classId, specialClassId }),
    });
  },

  /** Crear clase regular. */
  createClass: async (token, classData) => {
    return await fetchWithAuth("/classes/create", token, {
      method: "POST",
      body: JSON.stringify(classData),
    });
  },

  /** Actualizar clase regular. */
  updateClass: async (token, id, classData) => {
    return await fetchWithAuth("/classes/update", token, {
      method: "PUT",
      body: JSON.stringify({ id_clase: id, ...classData }),
    });
  },

  /** Borrado lógico de clase regular. */
  deleteClass: async (token, id) => {
    return await fetchWithAuth("/classes/delete", token, {
      method: "PUT",
      body: JSON.stringify({ classId: id }),
    });
  },

  /** Listar clases del plantel regular por día de semana. */
  getClassesByDay: async (token, id_dia) => {
    const data = await fetchWithAuth(`/classes/by-day?${q({ id_dia })}`, token);
    return normalizeArray(data);
  },

  /** Traer clases del usuario en una fecha. */
  getClassesByUser: async (token, userId, fecha) => {
    const endpoint = `/classes/by-user?${q({ userId, fecha })}`;
    const data = await fetchWithAuth(endpoint, token);
    return normalizeArray(data);
  },

  /** Traer clases del usuario en una fecha aunque no tenga créditos. */
  getClassesByUserNoCredits: async (token, userId, fecha) => {
    const endpoint = `/classes/by-user-no-credits?${q({ userId, fecha })}`;
    const data = await fetchWithAuth(endpoint, token);
    return normalizeArray(data);
  },

  /**
   * Actualizar asistencia (NORMAL o ESPECIAL).
   * Body: { tipo_clase: "normal" | "especial", id_clase, fecha, asistencias }
   * Controller: updateAttendance
   */
  updateAttendance: async (token, { tipo_clase, id_clase, fecha, asistencias }) => {
    if (!tipo_clase || !id_clase || !fecha || !asistencias) {
      throw new Error("tipo_clase, id_clase, fecha y asistencias son obligatorios");
    }
    return await fetchWithAuth("/classes/update-attendance", token, {
      method: "PUT",
      body: JSON.stringify({ tipo_clase, id_clase, fecha, asistencias }),
    });
  },

  /**
   * Check QR (tu SP actual contempla solo clases normales).
   * Controller: checkAttendanceQR
   */
  checkAttendanceQR: async (token, { id_usuario }) => {
    return await fetchWithAuth("/classes/check", token, {
      method: "POST",
      body: JSON.stringify({ id_usuario }),
    });
  },

  /**
   * Registrar asistencia individual (normal).
   * Controller: registerIndividualAttendance
   */
  registerIndividualAttendance: async (token, { classId, userId, date }) => {
    return await fetchWithAuth("/classes/register-attendance", token, {
      method: "PUT",
      body: JSON.stringify({ classId, userId, date }),
    });
  },
};

export default classService;
