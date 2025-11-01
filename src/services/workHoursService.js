// src/services/workHoursService.js
import { fetchWithAuth } from "./api";

// helper de query igual que en classService
const q = (obj = {}) =>
  Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

const BASE = "/workhours";

export const workHoursService = {
  // --- horas pactadas ---
  create: async (token, { user_id, work_hours, rate }) => {
    return await fetchWithAuth(`${BASE}/create`, token, {
      method: "POST",
      body: JSON.stringify({ user_id, work_hours, rate }),
    });
  },

  list: async (token, { user_id } = {}) => {
    const qs = q({ user_id });
    const endpoint = qs ? `${BASE}/list?${qs}` : `${BASE}/list`;
    return await fetchWithAuth(endpoint, token);
  },

  update: async (token, { id_pactado, work_hours, rate }) => {
    return await fetchWithAuth(`${BASE}/update`, token, {
      method: "PUT",
      body: JSON.stringify({ id_pactado, work_hours, rate }),
    });
  },

  softDelete: async (token, id_pactado) => {
    return await fetchWithAuth(`${BASE}/delete/${id_pactado}`, token, {
      method: "DELETE",
    });
  },

  // --- check in / out del día ---
  checkIn: async (token, { id_usuario, fecha, hora }) => {
    return await fetchWithAuth(`${BASE}/checkin`, token, {
      method: "POST",
      body: JSON.stringify({ id_usuario, fecha, hora }),
    });
  },

  checkOut: async (token, { id_usuario, fecha, hora }) => {
    return await fetchWithAuth(`${BASE}/checkout`, token, {
      method: "POST",
      body: JSON.stringify({ id_usuario, fecha, hora }),
    });
  },

  // estado de asistencia / check del día (para mostrar botones)
  getAttendanceStatus: async (token, { id_usuario, fecha }) => {
    const endpoint = `${BASE}/status?${q({ id_usuario, fecha })}`;
    return await fetchWithAuth(endpoint, token);
  },

  getCheckStatusDia: async (token, { id_usuario, fecha }) => {
    const endpoint = `${BASE}/check-status-dia?${q({ id_usuario, fecha })}`;
    return await fetchWithAuth(endpoint, token);
  },

  // --- horas trabajadas ---
  getWorkedHours: async (token, { id_usuario, periodo }) => {
    const endpoint = `${BASE}/worked-hours?${q({ id_usuario, periodo })}`;
    return await fetchWithAuth(endpoint, token);
  },

  getWorkedHoursByRange: async (token, { id_usuario, desde, hasta }) => {
    const endpoint = `${BASE}/worked-hours-range?${q({
      id_usuario,
      desde,
      hasta,
    })}`;
    return await fetchWithAuth(endpoint, token);
  },

  // --- listados globales para administrar ---
  getAsistenciasProfes: async (token, { desde, hasta, periodo }) => {
    const endpoint = `${BASE}/asistencias?${q({ desde, hasta, periodo })}`;
    return await fetchWithAuth(endpoint, token);
  },

  getHorasTrabajadasProfes: async (token, { desde, hasta, periodo }) => {
    const endpoint = `${BASE}/horas-profes?${q({ desde, hasta, periodo })}`;
    return await fetchWithAuth(endpoint, token);
  },

  // --- pre-liquidación y liquidar ---
  getPreLiquidacion: async (token, { id_usuario, periodo }) => {
    const endpoint = `${BASE}/pre-liquidacion?${q({ id_usuario, periodo })}`;
    return await fetchWithAuth(endpoint, token);
  },

  liquidarProfesor: async (token, { id_usuario, periodo, horas_pagadas }) => {
    return await fetchWithAuth(`${BASE}/liquidar`, token, {
      method: "POST",
      body: JSON.stringify({ id_usuario, periodo, horas_pagadas }),
    });
  },

  // --- liquidaciones por rango ---
  getLiquidacionesPorRango: async (token, { desde, hasta }) => {
    const endpoint = `${BASE}/liquidaciones?${q({ desde, hasta })}`;
    return await fetchWithAuth(endpoint, token);
  },

  // --- endpoints extras que tenés abajo en el .http de liquidaciones ---
  getProfesYAdmins: async (token) => {
    // esto es el endpoint que me pasaste en el mensaje
    return await fetchWithAuth(
      `/usuarios/profes-admins/buscar`,
      token,
      {}
    );
  },

  // /api/detalle?periodo=YYYY-MM
  getDetalleLiquidacionesByPeriod: async (token, { periodo }) => {
    return await fetchWithAuth(
      `/detalle?${q({ periodo })}`,
      token
    );
  },

  // /api/profesor?id_usuario=..&periodo=..
  getLiquidacionesProfesor: async (token, { id_usuario, periodo }) => {
    return await fetchWithAuth(
      `/profesor?${q({ id_usuario, periodo })}`,
      token
    );
  },

  // /api/profesor/resumen?id_usuario=..&periodo=..
  getResumenAsistenciaProfesor: async (token, { id_usuario, periodo }) => {
    return await fetchWithAuth(
      `/profesor/resumen?${q({ id_usuario, periodo })}`,
      token
    );
  },

  // /api/profesor/historial?id_usuario=..
  getHistorialLiquidaciones: async (token, { id_usuario }) => {
    return await fetchWithAuth(
      `/profesor/historial?${q({ id_usuario })}`,
      token
    );
  },
};

export default workHoursService;
