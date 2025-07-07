import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaSave } from 'react-icons/fa';
import '../styles/ManageExercises.css'; 

const ManageDisciplines = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState('');

  const fetchDisciplinas = async () => {
    const res = await fetch('http://localhost:3001/api/disciplinas');
    const data = await res.json();
    setDisciplinas(data);
  };

  useEffect(() => {
    fetchDisciplinas();
  }, []);

  const handleEditClick = (disciplina) => {
    setEditing(disciplina.id_disciplina);
    setEditName(disciplina.disciplina);
  };

  const handleEditSave = async (id) => {
    if (!editName) {
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
      const res = await fetch('http://localhost:3001/api/disciplinas/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disciplineId: id, name: editName })
      });
      if (res.ok) {
        Swal.fire('Actualizado', 'La disciplina fue actualizada.', 'success');
        setEditing(null);
        fetchDisciplinas();
      } else {
        Swal.fire('Error', 'No se pudo actualizar la disciplina.', 'error');
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la disciplina lógicamente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      const res = await fetch('http://localhost:3001/api/disciplinas/delete', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disciplineId: id })
      });
      if (res.ok) {
        Swal.fire('Eliminado', 'La disciplina fue eliminada.', 'success');
        fetchDisciplinas();
      } else {
        Swal.fire('Error', 'No se pudo eliminar la disciplina.', 'error');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditing(null);
  };

  return (
    <div className="CreateClassContainer">
      <h2>Editar/Eliminar Disciplinas</h2>
      <div className="checkbox-group">
        {disciplinas.map((d) => (
          <div key={d.id_disciplina} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {editing === d.id_disciplina ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  required
                />
                <button onClick={() => handleEditSave(d.id_disciplina)} title="Guardar"><FaSave /></button>
                <button onClick={handleCancelEdit} title="Cancelar">Cancelar</button>
              </>
            ) : (
              <>
                <h3 style={{ margin: 0 }}>{d.disciplina}</h3>
                <div className='div-buttons'>
                <button onClick={() => handleEditClick(d)} title="Editar"><FaEdit /></button>
                <button onClick={() => handleDelete(d.id_disciplina)} title="Eliminar"><FaTrash /></button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageDisciplines;