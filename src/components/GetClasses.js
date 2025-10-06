import React, { useEffect, useState, useCallback } from 'react';
import { FaEdit, FaTrash, FaSave, FaCalendarAlt } from 'react-icons/fa';
import '../styles/CreateClass.css';
import { useAuth } from '../AuthContext'; // Importar el AuthContext

const ViewClasses = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [clases, setClases] = useState([]);
  const [editingClassId, setEditingClassId] = useState(null);
  const [editedClass, setEditedClass] = useState({});
  const [fechaHoy, setFechaHoy] = useState(() => new Date().toISOString().split('T')[0]);
  const { getToken } = useAuth(); // Obtener la función getToken

  const fetchDisciplinas = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error("No hay token disponible");
        return;
      }

      const res = await fetch(`https://backturnero.onrender.com/api/disciplinas`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      // Asegurarse de que data sea un array
      let disciplinasArray = [];
      
      if (Array.isArray(data)) {
        disciplinasArray = data;
      } else if (data.disciplinas && Array.isArray(data.disciplinas)) {
        disciplinasArray = data.disciplinas;
      } else if (data.data && Array.isArray(data.data)) {
        disciplinasArray = data.data;
      }
      
      setDisciplinas(disciplinasArray);
    } catch (error) {
      console.error("Error fetching disciplines:", error);
      setDisciplinas([]);
    }
  }, [getToken]);

  const fetchClases = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error("No hay token disponible");
        return;
      }

      const res = await fetch(`https://backturnero.onrender.com/api/classes/all?fecha=${fechaHoy}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      setClases(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setClases([]);
    }
  }, [fechaHoy, getToken]);

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
      const token = getToken();
      if (!token) {
        alert("No hay token de autenticación disponible");
        return;
      }

      const response = await fetch(`https://backturnero.onrender.com/api/classes/update`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id_clase: id, ...editedClass })
      });

      if (response.ok) {
        setEditingClassId(null);
        fetchClases();
        alert("Clase actualizada exitosamente");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error al guardar cambios");
      }
    } catch (error) {
      console.error("Error al editar:", error);
      alert("Error de conexión al guardar cambios");
    }
  };

  const handleDeleteClass = async (id) => {
    const confirm = window.confirm("¿Seguro que deseas eliminar esta clase?");
    if (!confirm) return;

    try {
      const token = getToken();
      if (!token) {
        alert("No hay token de autenticación disponible");
        return;
      }

      const response = await fetch(`https://backturnero.onrender.com/api/classes/delete`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ classId: id })
      });

      if (response.ok) {
        setClases(prev => prev.filter(c => c.id_clase !== id));
        alert("Clase eliminada exitosamente");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error al eliminar la clase");
      }
    } catch (error) {
      console.error("Error eliminando:", error);
      alert("Error de conexión al eliminar la clase");
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
        {clases.length > 0 ? (
          clases.map((c) => (
            <div key={c.id_clase} className="plan-item">
              {editingClassId === c.id_clase ? (
                <div className="edit-mode">
                  <div className="form-group">
                    <label>Disciplina:</label>
                    <select 
                      value={editedClass.id_disciplina} 
                      onChange={e => setEditedClass(prev => ({ ...prev, id_disciplina: e.target.value }))}
                    >
                      {disciplinas.length > 0 ? (
                        disciplinas.map(d => (
                          <option key={d.id_disciplina || d.id} value={d.id_disciplina || d.id}>
                            {d.nombre || d.disciplina || d.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No hay disciplinas</option>
                      )}
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
                      min="1"
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
                  <h3>{c.disciplina || "Sin nombre"}</h3>
                  <p><strong>Hora:</strong> {c.hora}</p>
                  <p><strong>Capacidad:</strong> {c.disponibles || c.capacidad_max}</p>
                  <p><strong>Día:</strong> {getDiaNombre(c.id_dia)}</p>
                  
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
          ))
        ) : (
          <div className="no-classes">
            <p>No hay clases para la fecha seleccionada</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewClasses;