import React, { useState, useEffect } from 'react';
import { FaSearch, FaMoneyBillWave, FaCheck, FaUser } from 'react-icons/fa';
import Swal from 'sweetalert2';
import '../styles/RegistrarCuota.css';
import { userService } from '../services/userService';
import { planService } from '../services/planService';
import { paymentService } from '../services/paymentService';

const RegistrarCuota = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [planes, setPlanes] = useState([]);
  const [idPlan, setIdPlan] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [pagado, setPagado] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Guardrail: si no hay token
  useEffect(() => {
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesión requerida',
        text: 'Iniciá sesión para operar. No se encontró token.',
      });
    }
  }, [token]);

  // Buscar usuarios (con token)
  useEffect(() => {
    let abort = false;

    const run = async () => {
      if (!token) return;
      if (nombreUsuario.trim().length < 1) {
        setUsuarios([]);
        setShowSuggestions(false);
        return;
      }
      try {
        const data = await userService.searchByName(token, nombreUsuario.trim());
        if (abort) return;
        const list = Array.isArray(data) ? data : (data.usuarios || []);
        setUsuarios(list);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Buscar usuarios:', err);
        setUsuarios([]);
        setShowSuggestions(false);
      }
    };

    run();
    return () => { abort = true; };
  }, [nombreUsuario, token]);

  // Obtener planes (con token)
  useEffect(() => {
    let abort = false;

    const loadPlanes = async () => {
      if (!token) return;
      try {
        const data = await planService.getPlanes(token);
        if (abort) return;
        const list = Array.isArray(data) ? data : (data.planes || []);
        setPlanes(list);
      } catch (err) {
        console.error('Obtener planes:', err);
        setPlanes([]);
        Swal.fire({
          icon: 'error',
          title: 'No se pudieron cargar los planes',
          text: 'Revisá la conexión o tu sesión.',
        });
      }
    };

    loadPlanes();
    return () => { abort = true; };
  }, [token]);

  const handleUsuarioClick = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setNombreUsuario(usuario.nombre);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesión requerida',
        text: 'Iniciá sesión para registrar la cuota.',
      });
      return;
    }

    if (!usuarioSeleccionado || !idPlan || !metodoPago) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos obligatorios.',
      });
      return;
    }

    try {
      setLoading(true);

      await paymentService.registerFee(token, {
        id_usuario: usuarioSeleccionado.id_usuario,
        id_plan: Number(idPlan),
        metodo_pago: metodoPago,
        pagado: Boolean(pagado),
      });

      await Swal.fire({
        icon: 'success',
        title: 'Cuota registrada exitosamente',
        showConfirmButton: false,
        timer: 1500,
      });

      // Reset
      setNombreUsuario('');
      setUsuarioSeleccionado(null);
      setIdPlan('');
      setMetodoPago('');
      setPagado(false);
      setUsuarios([]);
      setShowSuggestions(false);

    } catch (error) {
      console.error('Registrar cuota:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: (error?.message || 'No se pudo registrar la cuota. Inténtalo de nuevo.'),
      });
    } finally {
      setLoading(false);
    }
  };

  const getPlanNombre = (planId) => {
    const plan = planes.find(p => p.id_plan === Number(planId));
    return plan ? plan.nombre : 'Plan no encontrado';
  };

  return (
    <div className="registrar-cuota-container">
      <div className="registrar-cuota-box">
        <h2 className="registrar-cuota-title">Registrar Cuota</h2>
        <p className="registrar-cuota-subtitle">
          Registra el pago de cuotas de los usuarios del sistema.
        </p>

        <form className="registrar-cuota-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>
              <FaSearch className="field-icon" />
              Buscar usuario
            </label>
            <div className="search-container">
              <input
                type="text"
                value={nombreUsuario}
                onChange={(e) => {
                  setNombreUsuario(e.target.value);
                  setUsuarioSeleccionado(null);
                }}
                placeholder="Escribe el nombre del usuario..."
                required
                autoComplete="off"
                className="search-input"
                disabled={!token || loading}
              />
              {showSuggestions && usuarios.length > 0 && (
                <div className="suggestions-dropdown">
                  {usuarios.map((usuario) => (
                    <div
                      key={usuario.id_usuario}
                      className="suggestion-item"
                      onClick={() => handleUsuarioClick(usuario)}
                    >
                      <FaUser className="user-icon" />
                      <div className="user-info">
                        <span className="user-name">{usuario.nombre}</span>
                        {usuario.email && (
                          <span className="user-email">{usuario.email}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {usuarioSeleccionado && (
            <div className="selected-user">
              <div className="user-badge">
                <FaUser className="user-icon" />
                <div className="user-details">
                  <span className="user-name">{usuarioSeleccionado.nombre}</span>
                  {usuarioSeleccionado.email && (
                    <span className="user-email">{usuarioSeleccionado.email}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="form-field">
            <label>
              <FaMoneyBillWave className="field-icon" />
              Plan de pago
            </label>
            <select
              value={idPlan}
              onChange={(e) => setIdPlan(e.target.value)}
              required
              disabled={loading || !token}
            >
              <option value="">Selecciona un plan</option>
              {planes.map((plan) => (
                <option key={plan.id_plan} value={plan.id_plan}>
                  {plan.nombre} - ${plan.monto}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Método de pago</label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              required
              disabled={loading || !token}
            >
              <option value="">Selecciona un método</option>
              <option value="efectivo">💵 Efectivo</option>
              <option value="transferencia">🏦 Transferencia</option>
            </select>
          </div>

          <div className="checkbox-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={pagado}
                onChange={(e) => setPagado(e.target.checked)}
                disabled={loading || !token}
                className="checkbox-input"
              />
              <span className="checkmark"></span>
              <FaCheck className="check-icon" />
              <span className="checkbox-text">¿Está pagado?</span>
            </label>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading || !usuarioSeleccionado || !idPlan || !metodoPago || !token}
          >
            {loading ? 'Registrando...' : 'Registrar Cuota'}
          </button>
        </form>

        {usuarioSeleccionado && idPlan && (
          <div className="fee-summary">
            <h4>Resumen de la cuota</h4>
            <div className="summary-details">
              <div className="summary-item">
                <span className="summary-label">Usuario:</span>
                <span className="summary-value">{usuarioSeleccionado.nombre}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Plan:</span>
                <span className="summary-value">{getPlanNombre(idPlan)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Método:</span>
                <span className="summary-value">
                  {metodoPago === 'efectivo' ? '💵 Efectivo' : '🏦 Transferencia'}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Estado:</span>
                <span className={`summary-value ${pagado ? 'paid' : 'pending'}`}>
                  {pagado ? '✅ Pagado' : '⏳ Pendiente'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrarCuota;
