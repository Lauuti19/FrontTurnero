import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext"; 
import { IoMdAddCircle } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import "../styles/UserRecords.css"; // Importar el archivo CSS

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

    fetch(`https://backturnero.onrender.com/api/rm/user/${id_usuario}`)
      .then(res => {
        if (!res.ok) throw new Error("Error al obtener records del usuario.");
        return res.json();
      })
      .then(data => {
        console.log('Data recibida:', data);
        
        if (Array.isArray(data)) {
          setRecords(data);
        } else if (data.data && Array.isArray(data.data)) {
          setRecords(data.data);
        } else if (Array.isArray(data[0])) {
          setRecords(data[0]);
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
        <div class="swal-custom-container">
          <div class="swal-form-group">
            <label class="swal-label">ID Ejercicio</label>
            <input id="swal-id-ejercicio" class="swal2-input swal-input" placeholder="ID del ejercicio">
          </div>
          <div class="swal-form-group">
            <label class="swal-label">Repeticiones</label>
            <input id="swal-reps" type="number" class="swal2-input swal-input" placeholder="Repeticiones">
          </div>
          <div class="swal-form-group">
            <label class="swal-label">Peso (kg)</label>
            <input id="swal-weight" type="number" step="0.1" class="swal2-input swal-input" placeholder="Peso">
          </div>
          <div class="swal-form-group">
            <label class="swal-label">Notas (opcional)</label>
            <input id="swal-notes" class="swal2-input swal-input" placeholder="Notas">
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
        
        fetch('https://backturnero.onrender.com/api/rm', {
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
        <div class="swal-custom-container">
          <div class="swal-flex-row">
            <div class="swal-flex-column">
              <label class="swal-label">Repeticiones</label>
              <input id="swal-reps" type="number" class="swal2-input edit-reps-input swal-readonly-input" value="${record.repeticiones}" placeholder="Repeticiones" readonly>
            </div>
            <div class="swal-flex-column">
              <label class="swal-label">Nuevo Peso (kg)</label>
              <input id="swal-weight" type="number" step="0.1" class="swal2-input edit-weight-input" value="${record.peso}" placeholder="Peso">
            </div>
          </div>
          <div class="swal-form-group">
            <label class="swal-label">Notas (opcional)</label>
            <input id="swal-notes" class="swal2-input edit-notes-input" value="${record.notas || ''}" placeholder="Notas">
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
        const weight = Swal.getPopup().querySelector('#swal-weight').value;
        const notes = Swal.getPopup().querySelector('#swal-notes').value;

        if (!record.repeticiones) {
          Swal.showValidationMessage('Las repeticiones son obligatorias');
          return false;
        }

        return { reps: record.repeticiones, weight, notes };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const id_usuario = getUserId();
        
        fetch('https://backturnero.onrender.com/api/rm/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_usuario: id_usuario,
            id_ejercicio: record.id_ejercicio,
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