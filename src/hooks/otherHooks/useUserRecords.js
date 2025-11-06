// hooks/useUserRecords.js
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../AuthContext";
import { useSweetAlert } from "../useSweetAlert";
import { useRM } from "../useRm";
import { useExercises } from "../useExercises";

export const useUserRecords = (userData, userId, token) => {
  const { getUserId } = useAuth();
  const { showRecordForm, showSuccess, showError } = useSweetAlert();
  const { searchExercisesByName } = useExercises(); // Usamos tu hook existente
  const {
    userRMs,
    loading,
    error,
    getRMsByUser,
    createRM,
    updateRM,
    clearError
  } = useRM();

  const [records, setRecords] = useState([]);

  // Función de búsqueda que usa tu hook useExercises
  const handleExerciseSearch = useCallback(async (searchTerm) => {
    if (!token) return [];
    try {
      const results = await searchExercisesByName(token, searchTerm);
      return Array.isArray(results) ? results : [];
    } catch (error) {
      console.error('Error en búsqueda de ejercicios:', error);
      return [];
    }
  }, [token, searchExercisesByName]);

  // 🔹 Cargar records al montar el componente
  useEffect(() => {
    const id_usuario = userId || getUserId();
    if (!token || !id_usuario) return;

    if (userData?.records && userData.records.length > 0) {
      setRecords(userData.records);
    } else {
      getRMsByUser(token, id_usuario);
    }
  }, [token, userId, userData, getUserId, getRMsByUser]);

  // 🔹 Sincronizar el estado local cuando cambie userRMs del hook useRM
  useEffect(() => {
    if (userRMs && Array.isArray(userRMs)) {
      setRecords(userRMs);
    }
  }, [userRMs]);

  // 🔹 Crear nuevo record
  const handleNewRecord = useCallback(async () => {
    const result = await showRecordForm(false, null, handleExerciseSearch);
    if (result.isConfirmed) {
      try {
        const id_usuario = userId || getUserId();
        const newRM = {
          id_usuario,
          id_ejercicio: result.value.id_ejercicio,
          peso: result.value.weight,
          repeticiones: result.value.reps,
          notas: result.value.notes || ""
        };

        await createRM(token, newRM);
        await showSuccess("Tu record se ha guardado correctamente.");
        await getRMsByUser(token, id_usuario);
      } catch (err) {
        console.error("Error creando record:", err);
        showError("No se pudo guardar el record.");
      }
    }
  }, [token, userId, getUserId, showRecordForm, createRM, showSuccess, getRMsByUser, showError, handleExerciseSearch]);

  // 🔹 Editar record existente
  const handleEditRecord = useCallback(async (record) => {
    const result = await showRecordForm(true, record);
    if (result.isConfirmed) {
      try {
        const id_usuario = userId || getUserId();
        const updateData = {
          id_usuario,
          id_ejercicio: record.id_ejercicio,
          repeticiones: result.value.reps,
          nuevo_peso: result.value.weight,
          nuevas_notas: result.value.notes || ""
        };

        await updateRM(token, updateData);
        await showSuccess("Tu record se ha actualizado correctamente.");
        await getRMsByUser(token, id_usuario);
      } catch (err) {
        console.error("Error actualizando record:", err);
        showError("No se pudo actualizar el record.");
      }
    }
  }, [token, userId, getUserId, showRecordForm, updateRM, showSuccess, getRMsByUser, showError]);

  return {
    records,
    loading,
    error,
    handleNewRecord,
    handleEditRecord,
    clearError
  };
};