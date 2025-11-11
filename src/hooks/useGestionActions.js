// hooks/useGestionActions.js
import { useCallback } from 'react';
import Swal from 'sweetalert2';
import { classService } from '../services/classService';
import { planService } from '../services/planService';
import { disciplineService } from '../services/disciplinaService';
import { exerciseService } from '../services/exerciseService';
import { userService } from '../services/userService';

export const useGestionActions = (section, onSuccess) => {
  const getToken = useCallback(() => localStorage.getItem('token'), []);

  const handleDelete = useCallback(async (item) => {
    const token = getToken();
    if (!token) {
      Swal.fire('Error', 'No hay token de autenticación', 'error');
      return false;
    }

    const result = await Swal.fire({
      title: `¿Eliminar ${section.slice(0, -1)}?`,
      text: `¿Estás seguro de eliminar "${item.nombre || item.name || item.nombre_clase || item.email}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        switch (section) {
          case 'clases':
            await classService.deleteClass(token, item.id_clase || item.id);
            break;
          case 'planes':
            await planService.deletePlan(token, item.id_plan || item.id);
            break;
          case 'disciplinas':
            await disciplineService.deleteDiscipline(token, item.id_disciplina || item.id);
            break;
          case 'ejercicios':
            await exerciseService.deleteExercise(token, item.id_ejercicio || item.id);
            break;
          case 'rutinas':
          case 'usuarios':
          case 'cuotas':
            throw new Error(`La eliminación de ${section} no está permitida o no está implementada`);
          default:
            throw new Error(`Eliminación no implementada para: ${section}`);
        }
        
        await Swal.fire('Eliminado!', `El ${section.slice(0, -1)} ha sido eliminado.`, 'success');
        onSuccess?.();
        return true;
      } catch (error) {
        console.error('Error eliminando:', error);
        Swal.fire('Error', `Error al eliminar: ${error.message}`, 'error');
        return false;
      }
    }
    return false;
  }, [section, getToken, onSuccess]);

  const handleCreate = useCallback(async (formData) => {
    const token = getToken();
    if (!token) throw new Error('No hay token de autenticación');

    try {
      let result;
      switch (section) {
        case 'clases':
          result = await classService.createClass(token, formData);
          break;
        case 'planes':
          result = await planService.createPlan(token, formData);
          break;
        case 'disciplinas':
          result = await disciplineService.createDiscipline(token, formData);
          break;
        case 'ejercicios':
          result = await exerciseService.createExercise(token, formData);
          break;
        case 'usuarios':
          result = await userService.createUser(token, formData);
          break;
        case 'rutinas':
        case 'cuotas':
          throw new Error(`Creación de ${section} no implementada`);
        default:
          throw new Error(`Creación no implementada para: ${section}`);
      }
      
      Swal.fire('Éxito', `${section.slice(0, -1)} creado correctamente`, 'success');
      return result;
    } catch (error) {
      Swal.fire('Error', `Error al crear: ${error.message}`, 'error');
      throw error;
    }
  }, [section, getToken]);

  const handleUpdate = useCallback(async (item, formData) => {
    const token = getToken();
    if (!token) throw new Error('No hay token de autenticación');

    try {
      const updateData = {
        ...formData,
        id: item.id_clase || item.id_plan || item.id_disciplina || item.id_ejercicio || item.id_usuario || item.id
      };

      let result;
      switch (section) {
        case 'clases':
          result = await classService.updateClass(token, updateData);
          break;
        case 'planes':
          result = await planService.updatePlan(token, updateData);
          break;
        case 'disciplinas':
          result = await disciplineService.updateDiscipline(token, updateData);
          break;
        case 'ejercicios':
          result = await exerciseService.updateExercise(token, updateData);
          break;
        case 'usuarios':
          // Si tienes endpoint para actualizar usuarios
          result = await userService.updateUser(token, updateData);
          break;
        case 'rutinas':
        case 'cuotas':
          throw new Error(`Actualización de ${section} no implementada`);
        default:
          throw new Error(`Actualización no implementada para: ${section}`);
      }
      
      Swal.fire('Éxito', `${section.slice(0, -1)} actualizado correctamente`, 'success');
      return result;
    } catch (error) {
      Swal.fire('Error', `Error al actualizar: ${error.message}`, 'error');
      throw error;
    }
  }, [section, getToken]);

  const handleUpdatePassword = useCallback(async (userId, newPassword) => {
    const token = getToken();
    if (!token) throw new Error('No hay token de autenticación');

    try {
      const result = await userService.updatePassword(token, {
        id_usuario: userId,
        nuevaPassword: newPassword
      });
      
      Swal.fire('Éxito', 'Contraseña actualizada correctamente', 'success');
      return result;
    } catch (error) {
      Swal.fire('Error', `Error al actualizar contraseña: ${error.message}`, 'error');
      throw error;
    }
  }, [getToken]);

  return {
    handleDelete,
    handleCreate,
    handleUpdate,
    handleUpdatePassword
  };
};