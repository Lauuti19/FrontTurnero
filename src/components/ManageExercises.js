import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaSave } from 'react-icons/fa';
import { HiOutlineX } from "react-icons/hi";
import '../styles/ManageExercises.css'; 

const ManageExercises = () => {
  const [exercises, setExercises] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', link: '' });

  const fetchExercises = async () => {
    const res = await fetch('https://backturnero.onrender.com/api/exercises');
    const data = await res.json();
    setExercises(data);
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el ejercicio lógicamente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      const res = await fetch('https://backturnero.onrender.com/api/exercises/delete', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        Swal.fire('Eliminado', 'El ejercicio fue eliminado.', 'success');
        fetchExercises();
      } else {
        Swal.fire('Error', 'No se pudo eliminar el ejercicio.', 'error');
      }
    }
  };

  const handleEditClick = (exercise) => {
    setEditing(exercise.id_ejercicio);
    setEditForm({ name: exercise.nombre, link: exercise.link || '' });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async (id) => {
    if (!editForm.name) {
      Swal.fire('Error', 'El nombre es obligatorio.', 'error');
      return;
    }
    const result = await Swal.fire({
      title: '¿Guardar cambios?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      const res = await fetch('https://backturnero.onrender.com/api/exercises/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: editForm.name, link: editForm.link })
      });
      if (res.ok) {
        Swal.fire('Actualizado', 'El ejercicio fue actualizado.', 'success');
        setEditing(null);
        fetchExercises();
      } else {
        Swal.fire('Error', 'No se pudo actualizar el ejercicio.', 'error');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditing(null);
  };

  return (
    <div className="ManageExercisesContainer">
      <h2>Ejercicios</h2>
      <div className="info-group">
        {exercises.map((e) => (
          <div key={e.id_ejercicio} className="exercise-row">
            {/* Info del ejercicio */}
            <div className="exercise-info">
              {editing === e.id_ejercicio ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    required
                  />
                  <input
                    type="text"
                    name="link"
                    value={editForm.link}
                    onChange={handleEditChange}
                    placeholder="Link (opcional)"
                  />
                </>
              ) : (
                <>
                  <h3>{e.nombre}</h3>
                  {e.link && (
                    <a
                      href={e.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-ejercicio"
                    >
                      {e.link}
                    </a>
                  )}
                </>
              )}
            </div>

            {/* Botones */}
            <div className="exercise-buttons">
              {editing === e.id_ejercicio ? (
                <>
                  <button onClick={() => handleEditSave(e.id_ejercicio)} title="Guardar">
                    <FaSave />
                  </button>
                  <button onClick={handleCancelEdit} title="Cancelar">
                    <HiOutlineX />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEditClick(e)} title="Editar">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(e.id_ejercicio)} title="Eliminar">
                    <FaTrash />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default ManageExercises;