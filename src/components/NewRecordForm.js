import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";

const NewRecordForm = ({ onClose, onSuccess }) => {
  const { getUserId } = useAuth();
  const [ejercicios, setEjercicios] = useState([]);
  const [id_ejercicio, setIdEjercicio] = useState("");
  const [peso, setPeso] = useState("");
  const [repeticiones, setRepeticiones] = useState("");
  const [notas, setNotas] = useState("");

  useEffect(() => {
    fetch("https://backturnero.onrender.com/api/exercises")
      .then(res => res.json())
      .then(data => setEjercicios(data))
      .catch(err => console.error("Error fetching exercises:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRecord = {
      id_usuario: getUserId(),
      id_ejercicio: parseInt(id_ejercicio),
      peso: parseFloat(peso),
      repeticiones: parseInt(repeticiones),
      notas
    };

    fetch("https://backturnero.onrender.com/api/rm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRecord)
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al registrar el record.");
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
      <h3>Registrar Nuevo Record</h3>
      <form onSubmit={handleSubmit}>
        <select
          value={id_ejercicio}
          onChange={(e) => setIdEjercicio(e.target.value)}
          required
        >
          <option value="">Seleccione un ejercicio</option>
          {ejercicios.map((ej) => (
            <option key={ej.id_ejercicio} value={ej.id_ejercicio}>
              {ej.nombre}
            </option>
          ))}
        </select>

        <input 
          type="number" 
          placeholder="Peso (kg)" 
          value={peso} 
          onChange={(e) => setPeso(e.target.value)} 
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
          value={notas} 
          onChange={(e) => setNotas(e.target.value)} 
        />
        <button type="submit">Guardar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  </div>
);

};


export default NewRecordForm;
