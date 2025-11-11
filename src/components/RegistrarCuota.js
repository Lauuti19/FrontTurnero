// src/components/RegistrarCuota.js
import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';
import '../styles/RegistrarCuota.css';
import { usePlans } from '../hooks';
import { paymentService } from '../services/paymentService';
import Buscador from './Buscador';

const RegistrarCuota = () => {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [planes, setPlanes] = useState([]);
  const [idPlan, setIdPlan] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [pagado, setPagado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const { getPlanes } = usePlans();

  // 🔹 Alerta de éxito
  const showSuccessAlert = (title, message, userName = '', planName = '') => {
    Swal.fire({
      title,
      html:
        userName && planName
          ? `${message}<br><strong>${userName}</strong> - <strong>${planName}</strong>`
          : message,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#28a745',
      background: '#ffffff',
      iconColor: '#28a745',
      timer: 4000,
      timerProgressBar: true,
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp',
      },
    });
  };

  // 🔹 Alerta de error
  const showErrorAlert = (title, errorMessage) => {
    Swal.fire({
      title,
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#dc3545',
      background: '#ffffff',
      showClass: {
        popup: 'animate__animated animate__headShake',
      },
    });
  };

  // 🔹 Alerta de advertencia
  const showWarningAlert = (title, message) => {
    Swal.fire({
      title,
      text: message,
      icon: 'warning',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#ffc107',
      background: '#ffffff',
      iconColor: '#ffc107',
    });
  };

  // 🔹 Verificar token
  useEffect(() => {
    if (!token) {
      showWarningAlert(
        'Sesión requerida',
        'Iniciá sesión para operar. No se encontró token.'
      );
    }
  }, [token]);

  // 🔹 Obtener planes
  useEffect(() => {
    let abort = false;

    const loadPlanes = async () => {
      if (!token) {
        setFetchLoading(false);
        return;
      }

      try {
        setFetchLoading(true);
        setError('');
        const data = await getPlanes(token);
        if (abort) return;
        const list = Array.isArray(data) ? data : data.planes || [];
        setPlanes(list);
      } catch (err) {
        console.error('Obtener planes:', err);
        const errorMsg = err.message || 'No se pudieron cargar los planes';
        setError(errorMsg);
        showErrorAlert('Error al cargar planes', errorMsg);
        setPlanes([]);
      } finally {
        setFetchLoading(false);
      }
    };

    loadPlanes();
    return () => {
      abort = true;
    };
  }, [getPlanes, token]); // ✅ dependencias corregidas

  // 🔹 Selección de usuario
  const handleUsuarioSeleccionado = (usuario) => {
    setUsuarioSeleccionado(usuario);
  };

  // 🔹 Validaciones
  const validateForm = () => {
    if (!token) {
      showWarningAlert(
        'Sesión requerida',
        'Iniciá sesión para registrar la cuota.'
      );
      return false;
    }

    if (!usuarioSeleccionado) {
      showWarningAlert(
        'Usuario requerido',
        'Debes seleccionar un usuario para registrar la cuota.'
      );
      return false;
    }

    if (!idPlan) {
      showWarningAlert('Plan requerido', 'Debes seleccionar un plan de pago.');
      return false;
    }

    if (!metodoPago) {
      showWarningAlert(
        'Método de pago requerido',
        'Debes seleccionar un método de pago.'
      );
      return false;
    }

    return true;
  };

  // 🔹 Registrar cuota
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      Swal.fire({
        title: 'Registrando Cuota...',
        text: 'Por favor espera mientras registramos el pago',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await paymentService.registerFee(token, {
        id_usuario: usuarioSeleccionado.id_usuario,
        id_plan: Number(idPlan),
        metodo_pago: metodoPago,
        pagado: Boolean(pagado),
      });

      Swal.close();

      const planNombre = getPlanNombre(idPlan);
      showSuccessAlert(
        '¡Cuota Registrada!',
        'La cuota ha sido registrada exitosamente:',
        usuarioSeleccionado.nombre,
        planNombre
      );

      setUsuarioSeleccionado(null);
      setIdPlan('');
      setMetodoPago('');
      setPagado(false);
    } catch (error) {
      Swal.close();
      console.error('Registrar cuota:', error);
      const errorMsg =
        error?.message || 'No se pudo registrar la cuota. Inténtalo de nuevo.';
      setError(errorMsg);
      showErrorAlert('Error al registrar cuota', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Helpers
  const getPlanNombre = (planId) => {
    const plan = planes.find((p) => p.id_plan === Number(planId));
    return plan ? plan.nombre : 'Plan no encontrado';
  };

  const getPlanPrecio = (planId) => {
    const plan = planes.find((p) => p.id_plan === Number(planId));
    return plan ? plan.monto : 0;
  };

  const getMetodoPagoTexto = (metodo) => {
    const metodos = {
      efectivo: '💵 Efectivo',
      transferencia: '🏦 Transferencia',
    };
    return metodos[metodo] || metodo;
  };

  if (fetchLoading) {
    return (
      <div className="CreatePaymentContainer">
        <div className="loading-message">
          <FaSpinner className="spinner" />
          <p>Cargando planes disponibles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="CreatePaymentContainer">
      <h2 id="Title-Pagos">Registrar Cuota</h2>

      {error && (
        <div className="warning-message">
          <p>⚠️ {error}</p>
          <button onClick={() => setError('')} className="dismiss-btn">
            ×
          </button>
        </div>
      )}

      <form className="form-group-class" onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Buscar Usuario:</label>
          <Buscador
            onUsuarioSeleccionado={handleUsuarioSeleccionado}
            disabled={loading || !token}
          />
          <div className="helper-text">
            Busca y selecciona un usuario del sistema
          </div>
        </div>

        {usuarioSeleccionado && (
          <div className="selected-user-info">
            <div className="selected-user-card">
              <h4>Usuario Seleccionado:</h4>
              <div className="user-details">
                <div className="user-detail">
                  <strong>Nombre:</strong> {usuarioSeleccionado.nombre}
                </div>
                {usuarioSeleccionado.email && (
                  <div className="user-detail">
                    <strong>Email:</strong> {usuarioSeleccionado.email}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="form-row">
          <div className="form-field">
            <label>Plan de Pago:</label>
            <select
              value={idPlan}
              onChange={(e) => setIdPlan(e.target.value)}
              required
              disabled={loading || !token}
              className="plan-select"
            >
              <option value="">Selecciona un plan</option>
              {planes.map((plan) => (
                <option key={plan.id_plan} value={plan.id_plan}>
                  {plan.nombre} - ${plan.monto}
                </option>
              ))}
            </select>
            {idPlan && (
              <div className="plan-description">
                Plan seleccionado:{' '}
                <strong>{getPlanNombre(idPlan)}</strong> - $
                {getPlanPrecio(idPlan)}
              </div>
            )}
          </div>

          <div className="form-field">
            <label>Método de Pago:</label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              required
              disabled={loading || !token}
              className="payment-select"
            >
              <option value="">Selecciona un método</option>
              <option value="efectivo">💵 Efectivo</option>
              <option value="transferencia">🏦 Transferencia</option>
            </select>
            {metodoPago && (
              <div className="payment-description">
                Método: <strong>{getMetodoPagoTexto(metodoPago)}</strong>
              </div>
            )}
          </div>
        </div>

        <div className="checkbox-fees-field">
          <label className="checkbox-fees-container">
            <input
              type="checkbox"
              checked={pagado}
              onChange={(e) => setPagado(e.target.checked)}
              disabled={loading || !token}
              className="checkbox-fees-input"
            />
            <span className="checkbox-fees-label">¿Está pagado?</span>
          </label>
          <div className="checkbox-helper">
            Marca esta opción si el pago ya fue realizado
          </div>
        </div>

        {usuarioSeleccionado && idPlan && metodoPago && (
          <div className="payment-summary">
            <h4>Resumen de la Cuota</h4>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Usuario:</span>
                <span className="summary-value">
                  {usuarioSeleccionado.nombre}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Plan:</span>
                <span className="summary-value">{getPlanNombre(idPlan)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Monto:</span>
                <span className="summary-value price">
                  ${getPlanPrecio(idPlan)}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Método:</span>
                <span className="summary-value">
                  {getMetodoPagoTexto(metodoPago)}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Estado:</span>
                <span
                  className={`summary-value status ${
                    pagado ? 'paid' : 'pending'
                  }`}
                >
                  {pagado ? '✅ Pagado' : '⏳ Pendiente'}
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className={`btn-register-payment ${loading ? 'loading' : ''}`}
          disabled={
            loading || !usuarioSeleccionado || !idPlan || !metodoPago || !token
          }
        >
          {loading ? (
            <>
              <FaSpinner className="spinner" />
              Registrando Cuota...
            </>
          ) : (
            <>
              <FaMoneyBillWave />
              Registrar Cuota
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default RegistrarCuota;
