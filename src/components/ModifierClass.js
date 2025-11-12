// components/ModifierClass.jsx
import React from 'react';
import { FaCalendarPlus } from 'react-icons/fa';
import { useModifierClass } from '../hooks/useModifierClass';
import '../styles/CreateClasses.css'; 

const ModifierClass = () => {
  const {
    mode,
    setMode,
    classType,
    setClassType,
    disciplines,
    selectedDiscipline,
    setSelectedDiscipline,
    selectedDay,
    setSelectedDay,
    selectedDate,
    setSelectedDate,
    hora,
    setHora,
    capacidad,
    setCapacidad,
    descripcion,
    setDescripcion,
    activa,
    setActiva,
    classesList,
    loading,
    message,
    errorMsg,
    handleCreate,
    handleLoadClassesForEdit,
    handleSelectClass,
    handleUpdate,
    handleDelete,
    daysOptions,
  } = useModifierClass();

  return (
    <div className="create-class-container">
      <div className="create-class-box">
        {/* Header */}
        <div className="create-class-header">
          <div className="create-class-icon-container">
            <span className="create-class-icon">
              <FaCalendarPlus />
            </span>
          </div>
          <div className="create-class-title-content">
            <h1>Gestión de clases</h1>
            <p>
              Creá y administrá clases normales o especiales / feriados del gimnasio.
            </p>
          </div>
        </div>

        {/* Mensajes */}
        {errorMsg && (
          <div className="error-message">
            <div className="error-content">
              <div className="error-icon">⚠️</div>
              <div className="error-text">
                <p>{errorMsg}</p>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className="error-message" style={{ background: '#f8fff9', borderColor: '#51cf66' }}>
            <div className="error-content">
              <div className="error-icon">✅</div>
              <div className="error-text">
                <p style={{ color: '#2f9e44' }}>{message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Switches */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <button
            type="button"
            className="create-class-btn"
            style={{
              flex: 1,
              padding: '10px 16px',
              fontSize: '0.95rem',
              background:
                mode === 'create'
                  ? 'linear-gradient(135deg, #1a1a1a, #2d2d2d)'
                  : '#e9ecef',
              color: mode === 'create' ? '#fff' : '#333',
            }}
            onClick={() => setMode('create')}
          >
            Crear
          </button>
          <button
            type="button"
            className="create-class-btn"
            style={{
              flex: 1,
              padding: '10px 16px',
              fontSize: '0.95rem',
              background:
                mode === 'edit'
                  ? 'linear-gradient(135deg, #1a1a1a, #2d2d2d)'
                  : '#e9ecef',
              color: mode === 'edit' ? '#fff' : '#333',
            }}
            onClick={() => setMode('edit')}
          >
            Editar / Eliminar
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button
            type="button"
            className="create-class-btn"
            style={{
              flex: 1,
              padding: '10px 16px',
              fontSize: '0.9rem',
              background:
                classType === 'normal'
                  ? 'linear-gradient(135deg, #1a1a1a, #2d2d2d)'
                  : '#e9ecef',
              color: classType === 'normal' ? '#fff' : '#333',
            }}
            onClick={() => setClassType('normal')}
          >
            Clase normal
          </button>
          <button
            type="button"
            className="create-class-btn"
            style={{
              flex: 1,
              padding: '10px 16px',
              fontSize: '0.9rem',
              background:
                classType === 'especial'
                  ? 'linear-gradient(135deg, #1a1a1a, #2d2d2d)'
                  : '#e9ecef',
              color: classType === 'especial' ? '#fff' : '#333',
            }}
            onClick={() => setClassType('especial')}
          >
            Especial / feriado
          </button>
        </div>

        {/* Formulario principal */}
        <form className="create-class-form" onSubmit={handleCreate}>
          <div className="form-grid">
            {/* Disciplina */}
            <div className="form-field">
              <div className="field-header">
                <span className="field-icon">🏋️‍♀️</span>
                <label>Disciplina</label>
              </div>
              <select
                className="form-select"
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                required
              >
                <option value="">Seleccioná una disciplina</option>
                {disciplines.map((d) => (
                  <option key={d.id_disciplina} value={d.id_disciplina}>
                    {d.disciplina}
                  </option>
                ))}
              </select>
            </div>

            {/* Día o fecha */}
            {classType === 'normal' ? (
              <div className="form-field">
                <div className="field-header">
                  <span className="field-icon">📅</span>
                  <label>Día de la semana</label>
                </div>
                <select
                  className="form-select"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  required={mode === 'create'}
                >
                  <option value="">Seleccioná un día</option>
                  {daysOptions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="form-field">
                <div className="field-header">
                  <span className="field-icon">📆</span>
                  <label>Fecha (especial / feriado)</label>
                </div>
                <input
                  type="date"
                  className="form-input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required={mode === 'create'}
                />
              </div>
            )}

            {/* Hora */}
            <div className="form-field">
              <div className="field-header">
                <span className="field-icon">⏰</span>
                <label>Hora</label>
              </div>
              <input
                type="time"
                className="form-input"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                required
              />
            </div>

            {/* Capacidad */}
            <div className="form-field">
              <div className="field-header">
                <span className="field-icon">👥</span>
                <label>Capacidad máxima</label>
              </div>
              <input
                type="number"
                className="form-input"
                min="1"
                value={capacidad}
                onChange={(e) => setCapacidad(e.target.value)}
                required
              />
            </div>

            {/* Descripción solo para especial */}
            {classType === 'especial' && (
              <div className="form-field">
                <div className="field-header">
                  <span className="field-icon">📝</span>
                  <label>Descripción / motivo (opcional)</label>
                </div>
                <textarea
                  className="form-input"
                  rows={3}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Por ejemplo: Feriado, clase temática, cierre de mes..."
                />
              </div>
            )}

            {/* Checkbox activa solo editable para especiales en modo edit */}
            {mode === 'edit' && classType === 'especial' && (
              <div className="form-field">
                <div className="field-header">
                  <span className="field-icon">✅</span>
                  <label>Estado de la clase</label>
                </div>
                <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={activa}
                    onChange={(e) => setActiva(e.target.checked)}
                  />
                  Activa
                </label>
              </div>
            )}
          </div>

          {/* Botón crear solo en modo create */}
          {mode === 'create' && (
            <button
              type="submit"
              className={`create-class-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className="btn-spinner" />
              ) : (
                <>
                  <span className="btn-icon">
                    <FaCalendarPlus />
                  </span>
                  Crear clase {classType === 'normal' ? 'normal' : 'especial'}
                </>
              )}
            </button>
          )}
        </form>

        {/* Sección editar/eliminar */}
        {mode === 'edit' && (
          <div style={{ marginTop: '32px' }}>
            <div className="form-field">
              <div className="field-header">
                <span className="field-icon">🔍</span>
                <label>Cargar clases para editar</label>
              </div>
              <button
                type="button"
                className="create-class-btn"
                style={{ padding: '10px 16px', fontSize: '0.95rem' }}
                onClick={handleLoadClassesForEdit}
                disabled={loading}
              >
                {loading ? 'Cargando...' : 'Buscar clases'}
              </button>
            </div>

            <div className="form-field" style={{ marginTop: '16px' }}>
              <div className="field-header">
                <span className="field-icon">📋</span>
                <label>Seleccioná una clase</label>
              </div>

              {classesList.length === 0 && (
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  No hay clases para los filtros seleccionados.
                </p>
              )}

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {classesList.map((clase) => (
                  <li
                    key={clase.id_clase_especial || clase.id_original || clase.id_clase}
                    style={{
                      border: '1px solid #e9ecef',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      marginBottom: '8px',
                    }}
                  >
                    <label style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="radio"
                        name="selectedClass"
                        onChange={() => handleSelectClass(clase)}
                      />
                      <span>
                        <strong>{clase.disciplina}</strong>{' '}
                        {clase.hora && `- ${clase.hora.substring(0, 5)}`}{' '}
                        {clase.descripcion && `- ${clase.descripcion}`}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button
                type="button"
                className="create-class-btn"
                style={{ flex: 1, padding: '12px 16px', fontSize: '0.95rem' }}
                onClick={handleUpdate}
                disabled={loading}
              >
                Guardar cambios
              </button>
              <button
                type="button"
                className="create-class-btn"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  fontSize: '0.95rem',
                  background: '#f03e3e',
                }}
                onClick={handleDelete}
                disabled={loading}
              >
                Eliminar clase
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModifierClass;
