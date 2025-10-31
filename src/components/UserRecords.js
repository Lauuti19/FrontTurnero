import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext"; 
import { IoMdAddCircle } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import "../styles/UserRecords.css";

const MySwal = withReactContent(Swal);

const UserRecords = ({ userData, userId, token }) => {
  const { getUserId } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Usar los records que vienen por props
  useEffect(() => {
    if (userData && userData.records) {
      console.log('Records recibidos por props:', userData.records);
      setRecords(userData.records);
      setLoading(false);
    } else {
      // Si no vienen por props, intentar cargarlos
      fetchRecords();
    }
  }, [userData]);

  const fetchRecords = () => {
    const id_usuario = userId || getUserId();

    if (!id_usuario) {
      setError("No se encontró el ID del usuario.");
      setLoading(false);
      return;
    }

    setLoading(true);
    
    fetch(`https://backturnero-vvk6.onrender.com/api/rm/user/${id_usuario}`)
      .then(res => {
        if (!res.ok) throw new Error("Error al obtener records del usuario.");
        return res.json();
      })
      .then(data => {
        console.log('Data recibida:', data);
        
        let recordsData = [];
        
        // Procesar los records como lo hace tu servicio
        for (const key in data) {
          if (!isNaN(parseInt(key)) && data[key] && typeof data[key] === 'object') {
            recordsData.push(data[key]);
          }
        }
        
        // Si no hay records en propiedades numéricas, buscar en otras
        if (recordsData.length === 0) {
          if (Array.isArray(data)) {
            recordsData = data;
          } else if (data.data && Array.isArray(data.data)) {
            recordsData = data.data;
          } else if (data.records && Array.isArray(data.records)) {
            recordsData = data.records;
          }
        }
        
        setRecords(recordsData);
      })
      .catch(err => {
        console.error('Error fetching records:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  // Skeleton loading para records
  const renderSkeletonRecords = () => {
    return (
      <div className="records-skeleton">
        <div className="skeleton-records-header">
          <div className="skeleton-records-title"></div>
          <div className="skeleton-add-button"></div>
        </div>
        <div className="skeleton-records-list">
          {[1, 2, 3].map((item) => (
            <div className="skeleton-record-item" key={item}>
              <div className="skeleton-record-info">
                <div className="skeleton-record-title"></div>
                <div className="skeleton-record-data"></div>
                <div className="skeleton-record-notes"></div>
              </div>
              <div className="skeleton-edit-button"></div>
            </div>
          ))}
        </div>
      </div>
    );
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
      willClose: () => {
        const swalContainer = document.querySelector('.swal2-container');
        if (swalContainer) swalContainer.remove();
        Swal.close();
      },
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
        const id_usuario = userId || getUserId();
        
        fetch('https://backturnero-vvk6.onrender.com/api/rm', {
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
            // Recargar los records después de guardar
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
        const id_usuario = userId || getUserId();
        
        fetch('https://backturnero-vvk6.onrender.com/api/rm/update', {
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

  if (loading) return renderSkeletonRecords();
  if (error) return <div className="records-error">{error}</div>;

  return (
    <div className="records">
      <div className="records-header">
        <h2>Records</h2>
        <button className="add-record-btn" onClick={handleNewRecord}>
          <IoMdAddCircle />
        </button>
      </div>

      {records.length === 0 ? (
        <div className="records-empty">
          <div className="records-empty-icon">🏋️</div>
          <div className="records-empty-text">No hay records cargados</div>
          <div className="records-empty-subtext">Agrega tu primer record haciendo clic en el botón +</div>
        </div>
      ) : (
        <div className="records-list">
          {records.map((rec, index) => (
            <div className="record-item" key={rec.id_ejercicio || index}>
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