// components/UserRecords.jsx
import React, { useEffect, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import { useAuth } from "../AuthContext";
import { useSweetAlert } from "../hooks/useSweetAlert";
import { useRM } from "../hooks"; 
import "../styles/UserRecords.css";

const UserRecords = ({ userData, userId, token }) => {
  const { getUserId } = useAuth();
  const { showRecordForm, showSuccess, showError } = useSweetAlert();

  // ✅ Hook de RM con todas sus funciones
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

  // 🔹 Cargar records al montar el componente
  useEffect(() => {
    const id_usuario = userId || getUserId();
    if (!token || !id_usuario) return;

    // Si vienen records en userData, usarlos primero
    if (userData?.records && userData.records.length > 0) {
      setRecords(userData.records);
    } else {
      getRMsByUser(token, id_usuario);
    }
  }, [token, userId, userData, getUserId, getRMsByUser]);

  // 🔹 Sincronizar el estado local cuando cambie el hook
  useEffect(() => {
    if (userRMs && Array.isArray(userRMs)) {
      setRecords(userRMs);
    }
  }, [userRMs]);

  // 🔹 Crear nuevo record
  const handleNewRecord = async () => {
    const result = await showRecordForm(false);
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
  };

  // 🔹 Editar record existente
  const handleEditRecord = async (record) => {
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
  };

  // 🔹 Render de un record individual
  const RecordItem = ({ rec, index }) => (
    <div className="record-item" key={rec.id_ejercicio || index}>
      <div className="record-info">
        <h4>{rec.nombre_ejercicio || rec.ejercicio || `Ejercicio ${rec.id_ejercicio}`}</h4>
        <p>{rec.repeticiones} rep · {rec.peso}kg</p>
        {rec.notas && <p>Notas: {rec.notas}</p>}
      </div>
      <button className="edit-record-btn" onClick={() => handleEditRecord(rec)}>
        <FiEdit />
      </button>
    </div>
  );

  // 🔹 Estado vacío
  const EmptyState = () => (
    <div className="records-empty">
      <div className="records-empty-icon">🏋️</div>
      <div className="records-empty-text">No hay records cargados</div>
      <div className="records-empty-subtext">Agrega tu primer record haciendo clic en el botón +</div>
    </div>
  );

  // 🔹 Estado de carga
  if (loading) return <RecordsSkeleton />;

  // 🔹 Estado de error
  if (error) {
    return (
      <div className="records-error">
        <p>Error: {error}</p>
        <button onClick={clearError}>Reintentar</button>
      </div>
    );
  }

  // 🔹 Render principal
  return (
    <div className="records">
      <div className="records-header">
        <h2>Records</h2>
        <button className="add-record-btn" onClick={handleNewRecord}>
          <IoMdAddCircle />
        </button>
      </div>

      {records.length === 0 ? <EmptyState /> : (
        <div className="records-list">
          {records.map((rec, index) => (
            <RecordItem rec={rec} index={index} key={rec.id_ejercicio || index} />
          ))}
        </div>
      )}
    </div>
  );
};

// 🔹 Componente Skeleton separado
const RecordsSkeleton = () => (
  <div className="records-skeleton">
    <div className="skeleton-records-header">
      <div className="skeleton-records-title"></div>
      <div className="skeleton-add-button"></div>
    </div>
    <div className="skeleton-records-list">
      {[1, 2, 3].map((item) => (
        <div className="skeleton-record-item" key={item}>
          <div className="skeleton-record-info">
            <div className="skeleton-record-title"></div>
            <div className="skeleton-record-data"></div>
            <div className="skeleton-record-notes"></div>
          </div>
          <div className="skeleton-edit-button"></div>
        </div>
      ))}
    </div>
  </div>
);

export default UserRecords;
