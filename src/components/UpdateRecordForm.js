import React, { useState } from "react";
import { useAuth } from "../AuthContext";

const UpdateRecordForm = ({ record, onClose, onSuccess }) => {
  const { getUserId } = useAuth();
  const [nuevoPeso, setNuevoPeso] = useState(record.peso);
  const [repeticiones, setRepeticiones] = useState(record.repeticiones);
  const [nuevasNotas, setNuevasNotas] = useState(record.notas);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedRecord = {
      id_usuario: getUserId(),
      id_ejercicio: record.id_ejercicio,
      repeticiones: parseInt(repeticiones),
      nuevo_peso: parseFloat(nuevoPeso),
      nuevas_notas: nuevasNotas
    };

    fetch("https://backturnero-vvk6.onrender.com/api/rm/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedRecord)
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al actualizar el record.");
        return res.json();
      })
      .then(() => {
        onSuccess();
        onClose();
      })
      .catch(err => alert(err.message));
  };

  return (
  <div className="modal-overlay">
    <div className="modal">
      <h3>Actualizar Record</h3>
      <form onSubmit={handleSubmit}>
        <input 
          type="number" 
          placeholder="Nuevo Peso (kg)" 
          value={nuevoPeso} 
          onChange={(e) => setNuevoPeso(e.target.value)} 
          required 
        />
        <input 
          type="number" 
          placeholder="Repeticiones" 
          value={repeticiones} 
          onChange={(e) => setRepeticiones(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Notas" 
          value={nuevasNotas} 
          onChange={(e) => setNuevasNotas(e.target.value)} 
        />
        <button type="submit">Actualizar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  </div>
);

};

export default UpdateRecordForm;
