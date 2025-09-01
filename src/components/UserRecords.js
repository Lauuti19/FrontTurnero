import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext"; 
import { IoMdAddCircle } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const UserRecords = () => {
  const { getUserId } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, [getUserId]);

  const fetchRecords = () => {
    const id_usuario = getUserId();

    if (!id_usuario) {
      setError("No se encontró el ID del usuario.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3001/api/rm/user/${id_usuario}`)
      .then(res => {
        if (!res.ok) throw new Error("Error al obtener records del usuario.");
        return res.json();
      })
      .then(data => {
        console.log('Data recibida:', data); // Para debugging
        
        // El backend devuelve { data: [...] } o directamente el array?
        if (Array.isArray(data)) {
          setRecords(data);
        } else if (data.data && Array.isArray(data.data)) {
          setRecords(data.data);
        } else if (Array.isArray(data[0])) {
          setRecords(data[0]); // Para el formato de stored procedures
        } else {
          setError("Formato de respuesta no reconocido");
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleNewRecord = () => {
    MySwal.fire({
      title: '<strong>Nuevo Record</strong>',
      html: `
        <div style="text-align: left;">
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">ID Ejercicio</label>
            <input id="swal-id-ejercicio" class="swal2-input" placeholder="ID del ejercicio">
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Repeticiones</label>
            <input id="swal-reps" type="number" class="swal2-input" placeholder="Repeticiones">
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Peso (kg)</label>
            <input id="swal-weight" type="number" step="0.1" class="swal2-input" placeholder="Peso">
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Notas (opcional)</label>
            <input id="swal-notes" class="swal2-input" placeholder="Notas">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#fbf106',
      cancelButtonColor: '#d33',
      focusConfirm: false,
      preConfirm: () => {
        const id_ejercicio = Swal.getPopup().querySelector('#swal-id-ejercicio').value;
        const reps = Swal.getPopup().querySelector('#swal-reps').value;
        const weight = Swal.getPopup().querySelector('#swal-weight').value;
        const notes = Swal.getPopup().querySelector('#swal-notes').value;

        if (!id_ejercicio || !reps || !weight) {
          Swal.showValidationMessage('Por favor completa los campos obligatorios');
          return false;
        }

        return { id_ejercicio, reps, weight, notes };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const id_usuario = getUserId();
        
        fetch('http://localhost:3001/api/rm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_usuario,
            id_ejercicio: result.value.id_ejercicio,
            repeticiones: result.value.reps,
            peso: result.value.weight,
            notas: result.value.notes || null
          })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            MySwal.fire('¡Guardado!', 'Tu record se ha guardado correctamente.', 'success');
            fetchRecords();
          } else {
            MySwal.fire('Error', data.error || 'No se pudo guardar el record.', 'error');
          }
        })
        .catch(error => {
          MySwal.fire('Error', 'Hubo un problema al guardar.', 'error');
        });
      }
    });
  };

  const handleEditRecord = (record) => {
    MySwal.fire({
      title: '<strong>Editar Record</strong>',
      html: `
        <div style="text-align: left;">
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Repeticiones</label>
            <input id="swal-reps" type="number" class="swal2-input" value="${record.repeticiones}" placeholder="Repeticiones">
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Nuevo Peso (kg)</label>
            <input id="swal-weight" type="number" step="0.1" class="swal2-input" value="${record.peso}" placeholder="Peso">
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Notas (opcional)</label>
            <input id="swal-notes" class="swal2-input" value="${record.notas || ''}" placeholder="Notas">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#fbf106',
      cancelButtonColor: '#d33',
      focusConfirm: false,
      preConfirm: () => {
        const reps = Swal.getPopup().querySelector('#swal-reps').value;
        const weight = Swal.getPopup().querySelector('#swal-weight').value;
        const notes = Swal.getPopup().querySelector('#swal-notes').value;

        if (!reps) {
          Swal.showValidationMessage('Las repeticiones son obligatorias');
          return false;
        }

        return { reps, weight, notes };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const id_usuario = getUserId();
        
        // CORRECCIÓN: Ruta sin ID en la URL y body con estructura correcta
        fetch('http://localhost:3001/api/rm/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_usuario: id_usuario,
            id_ejercicio: record.id_ejercicio, // Usar el ID del record existente
            repeticiones: result.value.reps,
            nuevo_peso: result.value.weight,
            nuevas_notas: result.value.notes || null
          })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            MySwal.fire('¡Actualizado!', 'Tu record se ha actualizado correctamente.', 'success');
            fetchRecords();
          } else {
            MySwal.fire('Error', data.error || 'No se pudo actualizar el record.', 'error');
          }
        })
        .catch(error => {
          MySwal.fire('Error', 'Hubo un problema al actualizar.', 'error');
        });
      }
    });
  };

  if (loading) return <p>Cargando records...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="records">
      <div className="records-header">
        <h2>Records</h2>
        <button className="add-record-btn" onClick={handleNewRecord}>
          <IoMdAddCircle />
        </button>
      </div>

      {records.length === 0 ? (
        <p className="no-records">No hay records cargados.</p>
      ) : (
        <div className="records-list">
          {records.map((rec) => (
            <div className="record-item" key={rec.id_ejercicio}>
              <div className="record-info">
                <h4>{rec.ejercicio}</h4>
                <p>{rec.repeticiones} rep · {rec.peso}kg</p>
                {rec.notas && <p>Notas: {rec.notas}</p>}
              </div>
              <button
                className="edit-record-btn"
                onClick={() => handleEditRecord(rec)}
              >
                <FiEdit />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserRecords;