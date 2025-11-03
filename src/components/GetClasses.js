import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks';
import { useClasses } from '../hooks';


const ViewClasses = () => {
  const { getToken } = useAuth();
  const { getAllClasses, updateClass, deleteClass } = useClasses();

  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [updatedValues, setUpdatedValues] = useState({});

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = await getToken();
        const fechaHoy = new Date().toISOString().split("T")[0];
        const data = await getAllClasses(token, fechaHoy);
        setClases(data);
      } catch (error) {
        setError('Error al obtener las clases');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [getToken, getAllClasses]);

  const handleEdit = (clase) => {
    setSelectedClass(clase);
    setUpdatedValues({
      nombre: clase.nombre,
      disciplina: clase.disciplina,
      horario: clase.horario,
      cupo_maximo: clase.cupo_maximo,
    });
  };

  const handleUpdateClass = async () => {
    try {
      const token = await getToken();
      await updateClass(token, selectedClass.id_clase, updatedValues);
      setSelectedClass(null);
      window.location.reload();
    } catch (error) {
      alert('Error al actualizar la clase');
    }
  };

  const handleDeleteClass = async (id_clase) => {
    if (!window.confirm('¿Estás seguro de eliminar esta clase?')) return;

    try {
      const token = await getToken();
      await deleteClass(token, id_clase);
      window.location.reload();
    } catch (error) {
      alert('Error al eliminar la clase');
    }
  };

  if (loading) return <p>Cargando clases...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Clases Disponibles</h2>
      {clases.length === 0 ? <p>No hay clases para hoy</p> : (
        <ul>
          {clases.map((clase) => (
            <li key={clase.id_clase}>
              <strong>{clase.nombre}</strong> - {clase.disciplina} - {clase.horario} - Cupos: {clase.cupos_disponibles}/{clase.cupo_maximo}
              <button onClick={() => handleEdit(clase)}>Editar</button>
              <button onClick={() => handleDeleteClass(clase.id_clase)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}

      {selectedClass && (
        <div>
          <h3>Editar Clase</h3>
          <input type="text" value={updatedValues.nombre} onChange={(e) => setUpdatedValues({ ...updatedValues, nombre: e.target.value })} />
          <input type="text" value={updatedValues.disciplina} onChange={(e) => setUpdatedValues({ ...updatedValues, disciplina: e.target.value })} />
          <input type="text" value={updatedValues.horario} onChange={(e) => setUpdatedValues({ ...updatedValues, horario: e.target.value })} />
          <input type="number" value={updatedValues.cupo_maximo} onChange={(e) => setUpdatedValues({ ...updatedValues, cupo_maximo: e.target.value })} />
          <button onClick={handleUpdateClass}>Guardar</button>
          <button onClick={() => setSelectedClass(null)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default ViewClasses;
