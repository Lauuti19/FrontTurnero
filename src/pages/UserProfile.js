import React, { useEffect, useState } from 'react';
import { BiCog } from "react-icons/bi";
import { FaAddressCard, FaMobileAlt } from "react-icons/fa";
import { GoAlertFill } from "react-icons/go";
import '../styles/UserProfile.css';
import transition from '../transition';
import { useAuth } from '../AuthContext'; 
import UserRecords from "../components/UserRecords";
import CheckInOut from "../components/CheckInOut";

const UserProfile = () => {
  const { getUserId } = useAuth(); 
  const [usuario, setUsuario] = useState(null);
  const [cuota, setCuota] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [getUserId]);

  if (loading) {
    return <div className="user-profile-container"><p>Cargando datos...</p></div>;
  }

  if (error) {
    return <div className="user-profile-container"><p>{error}</p></div>;
  }

  // Determinar qué secciones mostrar según el rol
  const isAdmin = usuario.rol === "Administrador";
  const isProfesor = usuario.rol === "Profesor";
  const isAlumno = usuario.rol === "Alumno";

  return (
    <div className="user-profile-container">
      <div className="user-profile-box">
        <div className="profile-header">
          <div>
            <h2 className="user-profile-title">Mi Perfil</h2>
            <p className="user-mail">{usuario.email}</p>
          </div>
          <a href='/editar' className="settings-icon">
            <BiCog />
          </a>
        </div>

        <p className="user-rol">{usuario.rol}</p>

        <div className="profile-content">
          {/* Datos personales - visible para todos */}
          <div className="profile-card">
            <h3>Datos Personales</h3>
            <div className="Texto-Data"><FaAddressCard/> <strong>DNI:</strong><p> {usuario.dni}</p></div>
            <div className="Texto-Data"><FaMobileAlt/> <strong>Celular:</strong><p> {usuario.celular}</p></div>
          </div>

          {/* Cuota - solo alumnos */}
          {isAlumno && (
            <div className="profile-card">
              <h3>{cuota ? 'Cuota Activa' : 'Estado de Cuota'}</h3>
              {cuota ? (
                <>
                  <p><strong>Plan:</strong> {cuota.nombre_plan}</p>
                  <p><strong>Pago:</strong> {cuota.fecha_pago}</p>
                  <p><strong>Vence:</strong> {cuota.fecha_vencimiento}</p>
                  <p><strong>Estado:</strong> {cuota.estado_pago}</p>
                  <p><strong>Créditos:</strong> {cuota.creditos_disponibles}/{cuota.creditos_total}</p>
                </>
              ) : (
                <div className="Texto-Data"><p className="cuota-inactiva"><GoAlertFill /> No tiene una cuota activa</p></div>
              )}
            </div>
          )}

          {/* Records - profesores y alumnos */}
          {(isProfesor || isAlumno) && (
            <div className="profile-card records-card">
              <UserRecords />
            </div>
          )}

          {/* Check-in/out - solo Admin o Profesor */}
          {(isAdmin || isProfesor) && (
            <div className="profile-card">
              <CheckInOut />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default transition(UserProfile);
