import React, { useEffect, useState, useCallback } from 'react';
import { FaEdit, FaTrash, FaSave } from 'react-icons/fa';
import '../styles/CreateClass.css';

const ViewClasses = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [clases, setClases] = useState([]);
  const [editingClassId, setEditingClassId] = useState(null);
  const [editedClass, setEditedClass] = useState({});
  const [fechaHoy, setFechaHoy] = useState(() => new Date().toISOString().split('T')[0]);

  const fetchDisciplinas = useCallback(async () => {
    const res = await fetch(`http://localhost:3001/api/disciplinas`);
    const data = await res.json();
    setDisciplinas(data);
  }, []);

  const fetchClases = useCallback(async () => {
    const res = await fetch(`http://localhost:3001/api/classes/all?fecha=${fechaHoy}`);
    const data = await res.json();
    setClases(data);
  }, [fechaHoy]);

  useEffect(() => {
    fetchDisciplinas();
    fetchClases();
  }, [fetchDisciplinas, fetchClases]);

  const handleEditClick = (clase) => {
    setEditingClassId(clase.id_clase);
    setEditedClass({
      id_disciplina: clase.id_disciplina,
      id_dia: clase.id_dia,
      hora: clase.hora,
      capacidad_max: clase.capacidad_max
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/classes/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_clase: id, ...editedClass })
      });

      if (response.ok) {
        setEditingClassId(null);
        fetchClases();
      } else {
        alert("Error al guardar cambios");
      }
    } catch (error) {
      console.error("Error al editar:", error);
    }
  };

  const handleDeleteClass = async (id) => {
    const confirm = window.confirm("¿Seguro que deseas eliminar esta clase?");
    if (!confirm) return;

    try {
      const response = await fetch(`http://localhost:3001/api/classes/delete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId: id })
      });

      if (response.ok) {
        setClases(prev => prev.filter(c => c.id_clase !== id));
      } else {
        alert("Error al eliminar la clase");
      }
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  return (
    <div className="CreateClassContainer">
      <h2 id='Title-Clases'>Clases del día</h2>
      <div className="date-picker">
        <label>Fecha:</label>
        <input type="date" value={fechaHoy} onChange={e => setFechaHoy(e.target.value)} />
      </div>
      {clases.map((c) => (
        <div key={c.id_clase} className="plan-item">
          {editingClassId === c.id_clase ? (
            <>
              <select value={editedClass.id_disciplina} onChange={e => setEditedClass(prev => ({ ...prev, id_disciplina: e.target.value }))}>
                {disciplinas.map(d => (
                  <option key={d.id_disciplina} value={d.id_disciplina}>{d.disciplina}</option>
                ))}
              </select>
              <select value={editedClass.id_dia} onChange={e => setEditedClass(prev => ({ ...prev, id_dia: e.target.value }))}>
                <option value="1">Lunes</option>
                <option value="2">Martes</option>
                <option value="3">Miércoles</option>
                <option value="4">Jueves</option>
                <option value="5">Viernes</option>
                <option value="6">Sábado</option>
              </select>
              <input type="time" value={editedClass.hora} onChange={e => setEditedClass(prev => ({ ...prev, hora: e.target.value }))} />
              <input type="number" value={editedClass.capacidad_max} onChange={e => setEditedClass(prev => ({ ...prev, capacidad_max: e.target.value }))} />
              <button onClick={() => handleSaveEdit(c.id_clase)}><FaSave /></button>
            </>
          ) : (
            <>
              <h3>{c.disciplina}</h3>
              <p>Hora: {c.hora}</p>
              <p>Capacidad: {c.disponibles}</p>
              <button onClick={() => handleEditClick(c)}><FaEdit /></button>
            </>
          )}
          <button onClick={() => handleDeleteClass(c.id_clase)}><FaTrash /></button>
        </div>
      ))}
    </div>
  );
};

export default ViewClasses;