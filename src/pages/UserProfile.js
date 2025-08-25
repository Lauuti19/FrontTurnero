import React, { useEffect, useState } from 'react';
import { BiCreditCard } from "react-icons/bi";
import { BiAward } from "react-icons/bi";
import { BiCog } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import '../styles/UserProfile.css';
import transition from '../transition'
import { useAuth } from '../AuthContext'; 
import UserRecords from "../components/UserRecords.js";

const UserProfile = () => {
  const { getUserId } = useAuth(); 
  const [usuario, setUsuario] = useState(null);
  const [cuota, setCuota] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal"); // 👈 estado para mobile

  useEffect(() => {
    const id_usuario = getUserId(); 

    if (!id_usuario) {
      setError('No se encontró el ID del usuario.');
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3001/api/usuarios/${id_usuario}`)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener los datos del usuario.');
        return res.json();
      })
      .then(data => {
        setUsuario(data.datos_usuario);
        setCuota(data.cuota || null);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [getUserId]);

  if (loading) {
    return <div className="user-profile-container"><p>Cargando datos...</p></div>;
  }

  if (error) {
    return <div className="user-profile-container"><p>{error}</p></div>;
  }

  return (
    <div className="user-profile-container">
      <div className="user-profile-box">
        <h2 className="user-profile-title">Perfil</h2>
        <p className='user-mail'> {usuario.email}</p>
        <div className='top-info'>
          <p className='user-rol'>{usuario.rol}</p>
          <a href='/editar'><BiCog /></a>
        </div>

        <div className='separador-user'>
          {/* Datos personales y cuota */}
          <div className="user-form">
            <h2>Datos Personales</h2>
            <div className='resto-user-info'>
              <p><strong>DNI:</strong> {usuario.dni}</p>
              <p><strong>Celular:</strong> {usuario.celular}</p>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <h2 style={{ marginBottom: '0.5rem' }}>
                {cuota ? 'Cuota Activa' : 'Estado de Cuota'}
              </h2>
              {cuota ? (
                <div className='cuota-info'>
                  <p><strong>Plan:</strong> {cuota.nombre_plan}</p>
                  <p><strong>Fecha de Pago:</strong> {cuota.fecha_pago}</p>
                  <p><strong>Vencimiento:</strong> {cuota.fecha_vencimiento}</p>
                  <p><strong>Estado de Pago:</strong> {cuota.estado_pago}</p>
                  <p><strong>Créditos Totales:</strong> {cuota.creditos_total}</p>
                  <p><strong>Créditos Disponibles:</strong> {cuota.creditos_disponibles}</p>
                </div>
              ) : (
                <div className='cuota-info'>
                  <p className='cuota-inactiva'>
                    ⚠ No tiene una cuota activa. Por favor, renueve su plan.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Records en desktop */}
          <div className='Derecha'>
            <UserRecords />
          </div>
        </div>
      </div>

      {/* Versión mobile con tabs */}
      <div className="mobile-info-container">
        <div className="mobile-options">
          <button 
            className={activeTab === "personal" ? "active-tab" : ""} 
            onClick={() => setActiveTab("personal")}
          >
            <FiUser /> Datos
          </button>

          <button 
            className={activeTab === "fees" ? "active-tab" : ""} 
            onClick={() => setActiveTab("fees")}
          >
            <BiCreditCard /> Cuotas
          </button>

          <button 
            className={activeTab === "records" ? "active-tab" : ""} 
            onClick={() => setActiveTab("records")}
          >
            <BiAward /> Marcas
          </button>
        </div>

        <div className="mobile-content">
          {activeTab === "personal" && (
            <div className="mobile-personal">
              <h2>Datos Personales</h2>
              <p><strong>DNI:</strong> {usuario.dni}</p>
              <p><strong>Celular:</strong> {usuario.celular}</p>
            </div>
          )}

          {activeTab === "fees" && (
            <div className="mobile-fees">
              <h2>{cuota ? "Cuota Activa" : "Estado de Cuota"}</h2>
              {cuota ? (
                <>
                  <p><strong>Plan:</strong> {cuota.nombre_plan}</p>
                  <p><strong>Fecha de Pago:</strong> {cuota.fecha_pago}</p>
                  <p><strong>Vencimiento:</strong> {cuota.fecha_vencimiento}</p>
                  <p><strong>Estado de Pago:</strong> {cuota.estado_pago}</p>
                </>
              ) : (
                <p className='cuota-inactiva'>
                  ⚠ No tiene una cuota activa. Por favor, renueve su plan.
                </p>
              )}
            </div>
          )}

          {activeTab === "records" && (
            <div className="mobile-records">
              <UserRecords />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default transition(UserProfile);
