// components/managerComponents/optionsData/gestionClases.jsx
import React, { useState, useEffect } from 'react';
import { useClasses } from '../../../hooks/useClasses';
import { useAuth } from '../../../AuthContext';
import { useSweetAlert } from '../../../hooks/useSweetAlert';
import SkeletonLoader from '../../SkeletonLoader';
import './gestionClases.css';

const GestionClases = ({ currentDate, searchTerm }) => { // ✅ Agregar searchTerm como prop
  const { token } = useAuth();
  const { 
    getAllClasses, 
    createClass, 
    updateClass, // ✅ Agregar updateClass
    deleteClass, // ✅ Agregar deleteClass
    loading, 
    error, 
    clearError 
  } = useClasses();
  const { showSuccess, showError, showConfirmation } = useSweetAlert();

  const [classes, setClasses] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [actionType, setActionType] = useState(''); 

  useEffect(() => {
    loadClasses();
  }, [currentDate]);

  const loadClasses = async () => {
    try {
      const classesData = await getAllClasses(token, currentDate);
      setClasses(Array.isArray(classesData) ? classesData : []);
    } catch (err) {
      showError('Error al cargar las clases: ' + err.message);
    }
  };

  // Filtrar clases basado en el término de búsqueda
  const filteredClasses = classes.filter(clase =>
    clase.nombre?.toLowerCase().includes(searchTerm?.toLowerCase() || '') || // ✅ Agregar ? para manejar undefined
    clase.descripcion?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
    clase.disciplina?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
  );

  // Manejar creación de clase
  const handleCreateClass = async (classData) => {
    try {
      await createClass(token, classData);
      showSuccess('Clase creada exitosamente');
      setShowCreateModal(false);
      loadClasses();
    } catch (err) {
      showError('Error al crear la clase: ' + err.message);
    }
  };

  // Manejar edición de clase
  const handleEditClass = async (classData) => {
    try {
      await updateClass(token, classData); // ✅ Ahora updateClass está definido
      showSuccess('Clase actualizada exitosamente');
      setSelectedClass(null);
      setActionType('');
      loadClasses();
    } catch (err) {
      showError('Error al actualizar la clase: ' + err.message);
    }
  };

  // Manejar eliminación de clase
  const handleDeleteClass = async () => {
    const result = await showConfirmation(
      '¿Estás seguro?',
      `¿Deseas eliminar la clase "${selectedClass?.nombre}"? Esta acción no se puede deshacer.`,
      'warning'
    );

    if (result.isConfirmed) {
      try {
        await deleteClass(token, selectedClass.id); // ✅ Ahora deleteClass está definido
        showSuccess('Clase eliminada exitosamente');
        setSelectedClass(null);
        setActionType('');
        loadClasses();
      } catch (err) {
        showError('Error al eliminar la clase: ' + err.message);
      }
    }
  };

  // Abrir modal de confirmación para eliminar
  const openDeleteModal = (clase) => {
    setSelectedClass(clase);
    setActionType('delete');
  };

  // Abrir modal de edición
  const openEditModal = (clase) => {
    setSelectedClass(clase);
    setActionType('edit');
  };

  if (loading) {
    return (
      <div className="gestion-clases">
        <div className="clases-header">
          <SkeletonLoader type="text" height="32px" width="200px" />
          <SkeletonLoader type="text" height="40px" width="40px" />
        </div>
        <div className="clases-list">
          <SkeletonLoader type="card" count={3} height="120px" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={clearError}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="gestion-clases">
      {/* Header con título y botón de agregar */}
      <div className="clases-header">
        <h2>Gestión de Clases</h2>
        <button 
          className="add-button"
          onClick={() => setShowCreateModal(true)}
          title="Agregar nueva clase"
        >
          +
        </button>
      </div>

      {/* Lista de clases */}
      <div className="clases-list">
        {filteredClasses.length === 0 ? (
          <div className="empty-state">
            <p>No hay clases disponibles</p>
            <button 
              className="btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              Crear primera clase
            </button>
          </div>
        ) : (
          filteredClasses.map((clase) => (
            <ClassCard 
              key={clase.id} 
              clase={clase} 
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          ))
        )}
      </div>

      {/* Modal de creación */}
      {showCreateModal && (
        <CreateClassModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateClass}
        />
      )}

      {/* Modal de edición */}
      {actionType === 'edit' && selectedClass && (
        <EditClassModal
          clase={selectedClass}
          onClose={() => {
            setSelectedClass(null);
            setActionType('');
          }}
          onSave={handleEditClass}
        />
      )}

      {/* Modal de confirmación para eliminar */}
      {actionType === 'delete' && selectedClass && (
        <DeleteConfirmationModal
          clase={selectedClass}
          onClose={() => {
            setSelectedClass(null);
            setActionType('');
          }}
          onConfirm={handleDeleteClass}
        />
      )}
    </div>
  );
};

// Componente para tarjeta de clase individual
const ClassCard = ({ clase, onEdit, onDelete }) => {
  return (
    <div className="class-card">
      <div className="class-info">
        <h3 className="class-name">{clase.nombre}</h3>
        <p className="class-description">{clase.descripcion}</p>
        <div className="class-details">
          <span className="class-discipline">{clase.disciplina}</span>
          <span className="class-capacity">Capacidad: {clase.capacidad}</span>
          <span className="class-time">
            {clase.hora_inicio} - {clase.hora_fin}
          </span>
        </div>
      </div>
      <div className="class-actions">
        <button 
          className="btn-edit"
          onClick={() => onEdit(clase)}
          title="Editar clase"
        >
          ✏️
        </button>
        <button 
          className="btn-delete"
          onClick={() => onDelete(clase)}
          title="Eliminar clase"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

// Modal para crear clase
const CreateClassModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    capacidad: '',
    id_disciplina: '',
    hora_inicio: '',
    hora_fin: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Crear Nueva Clase</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Capacidad:</label>
            <input
              type="number"
              value={formData.capacidad}
              onChange={(e) => setFormData({...formData, capacidad: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Hora inicio:</label>
            <input
              type="time"
              value={formData.hora_inicio}
              onChange={(e) => setFormData({...formData, hora_inicio: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Hora fin:</label>
            <input
              type="time"
              value={formData.hora_fin}
              onChange={(e) => setFormData({...formData, hora_fin: e.target.value})}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">Crear Clase</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal para editar clase (similar al de crear)
const EditClassModal = ({ clase, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: clase.nombre || '',
    descripcion: clase.descripcion || '',
    capacidad: clase.capacidad || '',
    id_disciplina: clase.id_disciplina || '',
    hora_inicio: clase.hora_inicio || '',
    hora_fin: clase.hora_fin || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, id: clase.id });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Editar Clase</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Capacidad:</label>
            <input
              type="number"
              value={formData.capacidad}
              onChange={(e) => setFormData({...formData, capacidad: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Hora inicio:</label>
            <input
              type="time"
              value={formData.hora_inicio}
              onChange={(e) => setFormData({...formData, hora_inicio: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Hora fin:</label>
            <input
              type="time"
              value={formData.hora_fin}
              onChange={(e) => setFormData({...formData, hora_fin: e.target.value})}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">Actualizar Clase</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal de confirmación para eliminar
const DeleteConfirmationModal = ({ clase, onClose, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal confirmation-modal">
        <div className="modal-header">
          <h3>Confirmar Eliminación</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro de que deseas eliminar la clase <strong>"{clase.nombre}"</strong>?</p>
          <p>Esta acción no se puede deshacer.</p>
        </div>
        <div className="modal-actions">
          <button type="button" onClick={onClose}>Cancelar</button>
          <button type="button" className="btn-danger" onClick={onConfirm}>
            Eliminar Clase
          </button>
        </div>
      </div>
    </div>
  );
};

export default GestionClases;