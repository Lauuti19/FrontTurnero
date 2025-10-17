// services/disciplinaService.js
import { fetchWithAuth } from './api';

export const disciplinaService = {
  // Obtener todas las disciplinas
  getDisciplinas: async (token = null) => {
    try {
      if (token) {
        const data = await fetchWithAuth('/disciplinas', token);
        // Asegurar que siempre retornamos un array
        if (Array.isArray(data)) {
          return data;
        } else if (data && Array.isArray(data.disciplinas)) {
          return data.disciplinas;
        } else if (data && Array.isArray(data.data)) {
          return data.data;
        } else {
          console.warn('Formato inesperado de disciplinas:', data);
          return [];
        }
      } else {
        const res = await fetch('https://backturnero-vvk6.onrender.com/api/disciplinas');
        if (!res.ok) {
          throw new Error(`Error ${res.status} al obtener las disciplinas`);
        }
        const data = await res.json();
        return Array.isArray(data) ? data : data.disciplinas || data.data || [];
      }
    } catch (error) {
      console.error('Error en disciplinaService.getDisciplinas:', error);
      throw new Error(error.message || 'Error al obtener las disciplinas');
    }
  },

  // Crear una nueva disciplina
  createDisciplina: async (token, disciplinaData) => {
    try {
      return await fetchWithAuth('/disciplinas/create', token, {
        method: 'POST',
        body: JSON.stringify(disciplinaData)
      });
    } catch (error) {
      console.error('Error creando disciplina:', error);
      throw new Error(error.message || 'Error al crear la disciplina');
    }
  },

  // Actualizar disciplina
  updateDisciplina: async (token, id, disciplinaData) => {
    try {
      return await fetchWithAuth(`/disciplinas/update/${id}`, token, {
        method: 'PUT',
        body: JSON.stringify(disciplinaData)
      });
    } catch (error) {
      console.error('Error actualizando disciplina:', error);
      throw new Error(error.message || 'Error al actualizar la disciplina');
    }
  },

  // Eliminar disciplina
  deleteDisciplina: async (token, id) => {
    try {
      return await fetchWithAuth(`/disciplinas/delete/${id}`, token, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error eliminando disciplina:', error);
      throw new Error(error.message || 'Error al eliminar la disciplina');
    }
  }
};