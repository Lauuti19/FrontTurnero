// hooks/useSweetAlert.js
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Configuración base para evitar problemas de scroll
const swalConfig = {
  customClass: {
    container: 'swal2-container',
    popup: 'swal2-popup',
  },
  didOpen: () => {
    document.body.style.overflow = 'hidden';
  },
  didDestroy: () => {
    document.body.style.overflow = 'auto';
  }
};

export const useSweetAlert = () => {
  const showRecordForm = (isEdit = false, recordData = null) => {
    return MySwal.fire({
      ...swalConfig,
      title: `<strong>${isEdit ? 'Editar' : 'Nuevo'} Record</strong>`,
      html: getRecordFormHTML(isEdit, recordData),
      showCancelButton: true,
      confirmButtonText: isEdit ? 'Actualizar' : 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#fbf106',
      cancelButtonColor: '#d33',
      focusConfirm: false,
      showLoaderOnConfirm: true,
      preConfirm: () => validateRecordForm(isEdit, recordData),
      // ❌ NO uses willClose personalizado
    });
  };

  const showSuccess = (message) => {
    return MySwal.fire({
      ...swalConfig,
      icon: 'success',
      title: '¡Éxito!',
      text: message,
      timer: 2000,
      showConfirmButton: false
    });
  };

  const showError = (message) => {
    return MySwal.fire({
      ...swalConfig,
      icon: 'error',
      title: 'Error',
      text: message,
    });
  };

  return { showRecordForm, showSuccess, showError };
};

// Helper functions (SRP - Single Responsibility Principle)
const getRecordFormHTML = (isEdit, recordData) => {
  if (isEdit) {
    return `
      <div class="swal-custom-container">
        <div class="swal-flex-row">
          <div class="swal-flex-column">
            <label class="swal-label">Repeticiones</label>
            <input id="swal-reps" type="number" class="swal2-input edit-reps-input swal-readonly-input" 
                   value="${recordData.repeticiones}" readonly>
          </div>
          <div class="swal-flex-column">
            <label class="swal-label">Nuevo Peso (kg)</label>
            <input id="swal-weight" type="number" step="0.1" class="swal2-input edit-weight-input" 
                   value="${recordData.peso}" placeholder="Peso">
          </div>
        </div>
        <div class="swal-form-group">
          <label class="swal-label">Notas (opcional)</label>
          <input id="swal-notes" class="swal2-input edit-notes-input" 
                 value="${recordData.notas || ''}" placeholder="Notas">
        </div>
      </div>
    `;
  }

  return `
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
  `;
};

const validateRecordForm = (isEdit, recordData) => {
  if (isEdit) {
    const weight = Swal.getPopup().querySelector('#swal-weight').value;
    const notes = Swal.getPopup().querySelector('#swal-notes').value;

    if (!recordData.repeticiones) {
      Swal.showValidationMessage('Las repeticiones son obligatorias');
      return false;
    }

    return { reps: recordData.repeticiones, weight, notes };
  }

  const id_ejercicio = Swal.getPopup().querySelector('#swal-id-ejercicio').value;
  const reps = Swal.getPopup().querySelector('#swal-reps').value;
  const weight = Swal.getPopup().querySelector('#swal-weight').value;
  const notes = Swal.getPopup().querySelector('#swal-notes').value;

  if (!id_ejercicio || !reps || !weight) {
    Swal.showValidationMessage('Por favor completa los campos obligatorios');
    return false;
  }

  return { id_ejercicio, reps, weight, notes };
};