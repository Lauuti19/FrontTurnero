import { GoAlertFill } from "react-icons/go";
import { MdPayments } from "react-icons/md";
import { CgSandClock } from "react-icons/cg";
import { BiSolidError } from "react-icons/bi";
import { useState } from "react";
import { useAuth } from "../../AuthContext";
import { usePayments } from "../../hooks";

export const ProfileCuota = ({ cuota: initialCuota }) => {
  const { getUserId, getToken, user } = useAuth();
  const { payFee, loading: paymentLoading } = usePayments();
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCuota, setSelectedCuota] = useState(null);
  const [cuota, setCuota] = useState(initialCuota);

  const token = getToken();
  const userId = getUserId();

  const handlePayCuota = async (paymentMethod) => {
    if (!selectedCuota || !token) return;

    try {
      await payFee(token, {
        id_cuota: selectedCuota.id_cuota,
        metodo_pago: paymentMethod
      });
      
      // Actualizar el estado local de la cuota
      setCuota(prev => ({
        ...prev,
        estado: 'pagada',
        metodo_pago: paymentMethod,
        fecha_pago: new Date().toISOString()
      }));
      
      setShowPaymentModal(false);
      setSelectedCuota(null);
    } catch (error) {
      console.error('Error procesando pago:', error);
    }
  };

  const openPaymentModal = (cuotaData) => {
    setSelectedCuota(cuotaData);
    setShowPaymentModal(true);
  };

  if (!cuota) {
    return (
      <section className="profile-card">
        <h3>Estado de Cuota</h3>
        <p className="cuota-inactiva">
          <GoAlertFill /> Información de cuota no disponible
        </p>
      </section>
    );
  }

  const { estado, descripcion, fecha_vencimiento, monto, metodo_pago, nombre_plan, id_cuota } = cuota;

  const iconMap = {
    activa: <MdPayments id="active-fee-icon" />,
    pagada: <MdPayments id="active-fee-icon" />,
    pendiente: <CgSandClock id="pending-fee-icon" />,
    vencida: <BiSolidError id="unactive-fee-icon" />,
  };

  const getEstadoText = (estado) => {
    const estados = {
      activa: 'Activa',
      pagada: 'Pagada',
      pendiente: 'Pendiente',
      vencida: 'Vencida'
    };
    return estados[estado] || estado;
  };

  const isPayable = estado === 'pendiente' || estado === 'vencida';

  return (
    <>
      <section className="profile-card">
        <h3>Estado de Cuota</h3>
        <div className={`cuota-estado cuota-${estado || "inactiva"}`}>
          <span className="cuota-icon">{iconMap[estado] || <BiSolidError />}</span>
          <div className="cuota-info">
            
            {fecha_vencimiento && (
              <p className="cuota-detail">
                <strong>Vence:</strong> {new Date(fecha_vencimiento).toLocaleDateString()}
              </p>
            )}
            
            {monto && (
              <p className="cuota-detail">
                <strong>Monto:</strong> ${monto}
              </p>
            )}
            
            {metodo_pago && (
              <p className="cuota-detail">
                <strong>Método:</strong> {metodo_pago}
              </p>
            )}
            
            {nombre_plan && (
              <p className="cuota-detail">
                <strong>Plan:</strong> {nombre_plan}
              </p>
            )}

            {/* Botón de pago para cuotas pendientes o vencidas */}
            {isPayable && (
              <button 
                className={`pay-button ${paymentLoading ? 'loading' : ''}`}
                onClick={() => openPaymentModal(cuota)}
                disabled={paymentLoading}
              >
                {paymentLoading ? 'Procesando...' : 'Pagar Cuota'}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Modal de pago */}
      {showPaymentModal && selectedCuota && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <div className="payment-modal-header">
              <h3>Pagar Cuota</h3>
              <button 
                className="close-button"
                onClick={() => setShowPaymentModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="payment-details">
              <div className="payment-summary">
                <h4>Resumen de la cuota</h4>
                <p><strong>Plan:</strong> {selectedCuota.nombre_plan}</p>
                <p><strong>Monto:</strong> ${selectedCuota.monto}</p>
                <p><strong>Vencimiento:</strong> {new Date(selectedCuota.fecha_vencimiento).toLocaleDateString()}</p>
              </div>

              <div className="payment-methods">
                <h4>Selecciona método de pago:</h4>
                
                <button 
                  className="payment-method-btn"
                  onClick={() => handlePayCuota('Efectivo')}
                  disabled={paymentLoading}
                >
                  <span className="method-icon">💵</span>
                  <span className="method-text">Efectivo</span>
                </button>

                <button 
                  className="payment-method-btn"
                  onClick={() => handlePayCuota('Tarjeta')}
                  disabled={paymentLoading}
                >
                  <span className="method-icon">💳</span>
                  <span className="method-text">Tarjeta</span>
                </button>

                <button 
                  className="payment-method-btn"
                  onClick={() => handlePayCuota('Transferencia')}
                  disabled={paymentLoading}
                >
                  <span className="method-icon">🏦</span>
                  <span className="method-text">Transferencia</span>
                </button>
              </div>
            </div>

            {paymentLoading && (
              <div className="payment-loading">
                <div className="loading-spinner"></div>
                <p>Procesando pago...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};