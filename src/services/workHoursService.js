// src/services/workHoursService.js
import { fetchWithAuth } from "./api";

// Helper para crear querystrings
const q = (obj = {}) =>
  Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

const BASE = "/workhours";

export const workHoursService = {
  // --- CRUD de horas pactadas ---
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

  // --- Check-in / Check-out ---
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

  // --- Estado de asistencia / check del día ---
  getAttendanceStatus: async (token, { id_usuario, fecha }) => {
    const endpoint = `${BASE}/status?${q({ id_usuario, fecha })}`;
    return await fetchWithAuth(endpoint, token);
  },

  getCheckStatusDia: async (token, { id_usuario, fecha }) => {
    const endpoint = `${BASE}/check-status-dia?${q({ id_usuario, fecha })}`;
    return await fetchWithAuth(endpoint, token);
  },

  // --- Horas trabajadas ---
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

  // --- Listados globales (para administración) ---
  getAsistenciasProfes: async (token, { desde, hasta, periodo }) => {
    const endpoint = `${BASE}/asistencias?${q({ desde, hasta, periodo })}`;
    return await fetchWithAuth(endpoint, token);
  },

  getHorasTrabajadasProfes: async (token, { desde, hasta, periodo }) => {
    const endpoint = `${BASE}/horas-profes?${q({ desde, hasta, periodo })}`;
    return await fetchWithAuth(endpoint, token);
  },

  // --- Pre-liquidación y liquidar ---
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

  // --- Liquidaciones por rango ---
  getLiquidacionesPorRango: async (token, { desde, hasta }) => {
    const endpoint = `${BASE}/liquidaciones?${q({ desde, hasta })}`;
    return await fetchWithAuth(endpoint, token);
  },
};

export default workHoursService;
