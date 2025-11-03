// hooks/useGestionData.js
import { useState, useEffect } from 'react';
import { classService } from '../services/classService';
import { planService } from '../services/planService';
import { disciplineService } from '../services/disciplinaService';
import { exerciseService } from '../services/exerciseService';
import { authService } from '../services';

export const useGestionData = (section, currentDate = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No hay token de autenticación');
        }

        let result = [];

        switch (section) {
          case 'clases':
            if (!currentDate) {
              throw new Error('Se requiere fecha para cargar clases');
            }
            result = await classService.getAllClasses(token, currentDate);
            break;
          case 'planes':
            result = await planService.getPlanes(token);
            break;
          case 'disciplinas':
            result = await disciplineService.getDisciplinas(token);
            break;
          case 'ejercicios':
            result = await exerciseService.getExercises(token);
            break;
          case 'usuarios':
            result = await authService.registerClient(token);
            break;
          case 'cuotas':
            // Implementar cuando tengas el servicio
            console.warn('Servicio de cuotas no implementado');
            result = [];
            break;
          case 'rutinas':
            // No tienes endpoints para rutinas
            console.warn('Servicio de rutinas no implementado');
            result = [];
            break;
          default:
            result = [];
        }

        // Normalizar los datos según la respuesta de cada servicio
        const normalizedData = normalizeData(result, section);
        setData(normalizedData);
      } catch (err) {
        console.error(`Error cargando ${section}:`, err);
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (section) {
      loadData();
    }
  }, [section, currentDate]);

  // Función para normalizar datos según la estructura de cada servicio
  const normalizeData = (result, section) => {
    if (!result) return [];

    // Si es un array, devolver directamente
    if (Array.isArray(result)) return result;
    
    // Si tiene propiedad data, usar esa
    if (result.data && Array.isArray(result.data)) return result.data;
    
    // Buscar propiedades específicas por sección
    const propertyMap = {
      clases: ['classes', 'clases'],
      planes: ['planes', 'plans'],
      disciplinas: ['disciplinas', 'disciplines'],
      ejercicios: ['ejercicios', 'exercises'],
      usuarios: ['usuarios', 'users']
    };

    const properties = propertyMap[section] || [];
    for (const prop of properties) {
      if (result[prop] && Array.isArray(result[prop])) {
        return result[prop];
      }
    }

    // Si no se encuentra ninguna estructura conocida, devolver array vacío
    console.warn(`No se pudo normalizar datos para ${section}:`, result);
    return [];
  };

  const refetch = () => {
    // Recargar los datos
    setData([]);
    setLoading(true);
    setError(null);
  };

  return { data, loading, error, refetch };
};