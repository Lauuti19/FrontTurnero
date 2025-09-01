import React, { useEffect, useState, useCallback } from 'react';
import { FaEdit, FaTrash, FaSave, FaCalendarAlt } from 'react-icons/fa';
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

  // Función para obtener el nombre del día a partir del id
  const getDiaNombre = (idDia) => {
    const dias = {
      1: "Lunes",
      2: "Martes",
      3: "Miércoles",
      4: "Jueves",
      5: "Viernes",
      6: "Sábado",
      7: "Domingo"
    };
    return dias[idDia] || "";
  };

  return (
    <div className="CreateClassContainer">
      <div className="date-picker">
        <label><FaCalendarAlt /> Seleccionar fecha:</label>
        <input type="date" value={fechaHoy} onChange={e => setFechaHoy(e.target.value)} />
      </div>
      
      <div className="plans-list">
        {clases.map((c) => (
          <div key={c.id_clase} className="plan-item">
            {editingClassId === c.id_clase ? (
              <div className="edit-mode">
                <div className="form-group">
                  <label>Disciplina:</label>
                  <select 
                    value={editedClass.id_disciplina} 
                    onChange={e => setEditedClass(prev => ({ ...prev, id_disciplina: e.target.value }))}
                  >
                    {disciplinas.map(d => (
                      <option key={d.id_disciplina} value={d.id_disciplina}>{d.disciplina}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Día:</label>
                  <select 
                    value={editedClass.id_dia} 
                    onChange={e => setEditedClass(prev => ({ ...prev, id_dia: e.target.value }))}
                  >
                    <option value="1">Lunes</option>
                    <option value="2">Martes</option>
                    <option value="3">Miércoles</option>
                    <option value="4">Jueves</option>
                    <option value="5">Viernes</option>
                    <option value="6">Sábado</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Hora:</label>
                  <input 
                    type="time" 
                    value={editedClass.hora} 
                    onChange={e => setEditedClass(prev => ({ ...prev, hora: e.target.value }))} 
                  />
                </div>
                
                <div className="form-group">
                  <label>Capacidad máxima:</label>
                  <input 
                    type="number" 
                    value={editedClass.capacidad_max} 
                    onChange={e => setEditedClass(prev => ({ ...prev, capacidad_max: e.target.value }))} 
                  />
                </div>
                
                <div className="action-buttons">
                  <button className="btn-save" onClick={() => handleSaveEdit(c.id_clase)}>
                    <FaSave /> Guardar
                  </button>
                  <button className="btn-cancel" onClick={() => setEditingClassId(null)}>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="view-mode">
                <h3>{c.disciplina}</h3>
                <p><strong>Hora:</strong> {c.hora}</p>
                <p><strong>Capacidad:</strong> {c.disponibles}</p>
                
                <div className="action-buttons">
                  <button className="btn-edit" onClick={() => handleEditClick(c)}>
                    <FaEdit /> Editar
                  </button>
                  <button className="btn-delete" onClick={() => handleDeleteClass(c.id_clase)}>
                    <FaTrash /> Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewClasses;