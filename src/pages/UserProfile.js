import React, { useEffect, useState } from 'react';
import { BiCog } from "react-icons/bi";
import { FaAddressCard, FaMobileAlt } from "react-icons/fa";
import { GoAlertFill } from "react-icons/go";
import '../styles/UserProfile.css';
import transition from '../transition';
import { getFullUserData } from '../services/userService';
import { useAuth } from '../AuthContext';
import UserRecords from "../components/UserRecords";
import CheckInOut from "../components/CheckInOut";

const UserProfile = () => {
  const { getToken, getUserId, usuario: usuarioAuth } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [cuota, setCuota] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const userId = getUserId();

    if (!token || !userId) {
      setError('No hay sesión activa');
      setLoading(false);
      return;
    }

    getFullUserData(token, userId)
      .then(data => {
        // Usar directamente los datos del servicio que ya vienen combinados
        const usuarioCompleto = {
          id_usuario: data.id_usuario,
          email: data.email,
          nombre: data.nombre,
          id_rol: data.id_rol,
          rol: data.id_rol === 1 ? "Administrador" : 
               data.id_rol === 2 ? "Profesor" : "Alumno",
          dni: data.dni || "No disponible",
          celular: data.celular || "No disponible"
        };
        setUsuario(usuarioCompleto);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al obtener datos del usuario:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [getToken, getUserId]);

  // Fallback con datos de AuthContext si el servicio falla
  useEffect(() => {
    if (usuarioAuth && !usuario && !loading && error) {
      console.log("Usando datos de AuthContext como fallback:", usuarioAuth);
      const usuarioFromAuth = {
        id_usuario: usuarioAuth.id_usuario || usuarioAuth.id,
        email: usuarioAuth.email,
        nombre: usuarioAuth.nombre,
        id_rol: usuarioAuth.id_rol,
        rol: usuarioAuth.id_rol === 1 ? "Administrador" : 
             usuarioAuth.id_rol === 2 ? "Profesor" : "Alumno",
        dni: usuarioAuth.dni || "No disponible",
        celular: usuarioAuth.celular || "No disponible"
      };
      setUsuario(usuarioFromAuth);
      setError(null); // Limpiar el error ya que tenemos datos de fallback
    }
  }, [usuarioAuth, usuario, loading, error]);

  // Skeleton loading para el perfil
  const renderSkeletonProfile = () => {
    return (
      <div className="user-profile-container">
        <div className="user-profile-box">
          {/* Skeleton Header */}
          <div className="profile-header skeleton-header">
            <div className="skeleton-user-info">
              <div className="skeleton-text skeleton-title"></div>
              <div className="skeleton-text skeleton-email"></div>
              <div className="skeleton-text skeleton-name"></div>
            </div>
            <div className="skeleton-settings-icon"></div>
          </div>

          {/* Skeleton Role */}
          <div className="skeleton-role"></div>

          {/* Skeleton Cards */}
          <div className="profile-content">
            {/* Datos Personales Skeleton */}
            <div className="profile-card skeleton-card">
              <div className="skeleton-text skeleton-card-title"></div>
              <div className="skeleton-data-item">
                <div className="skeleton-icon"></div>
                <div className="skeleton-text skeleton-data-text"></div>
              </div>
              <div className="skeleton-data-item">
                <div className="skeleton-icon"></div>
                <div className="skeleton-text skeleton-data-text"></div>
              </div>
            </div>

            {/* Cuota Skeleton */}
            <div className="profile-card skeleton-card">
              <div className="skeleton-text skeleton-card-title"></div>
              <div className="skeleton-data-item">
                <div className="skeleton-text skeleton-cuota-text"></div>
              </div>
            </div>

            {/* Records Skeleton */}
            <div className="profile-card skeleton-card records-card">
              <div className="skeleton-text skeleton-card-title"></div>
              <div className="skeleton-records">
                <div className="skeleton-record-item"></div>
                <div className="skeleton-record-item"></div>
                <div className="skeleton-record-item"></div>
              </div>
            </div>

            {/* Check-in/out Skeleton */}
            <div className="profile-card skeleton-card">
              <div className="skeleton-text skeleton-card-title"></div>
              <div className="skeleton-checkin">
                <div className="skeleton-button"></div>
                <div className="skeleton-button"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return renderSkeletonProfile();
  }

  if (error && !usuario) {
    return (
      <div className="user-profile-container">
        <div className="user-profile-box">
          <div className="error-message">
            <h2>Error</h2>
            <p>{error}</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="btn primary"
            >
              Volver al Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Determinar qué secciones mostrar según el rol
  const isAdmin = usuario?.id_rol === 1;
  const isProfesor = usuario?.id_rol === 2;
  const isAlumno = usuario?.id_rol === 3;

  return (
    <div className="user-profile-container">
      <div className="user-profile-box">
        <div className="profile-header">
          <div>
            <h2 className="user-profile-title">Mi Perfil</h2>
            <p className="user-mail">{usuario?.email}</p>
            <p className="user-name">{usuario?.nombre}</p>
          </div>
          <a href='/editar' className="settings-icon">
            <BiCog />
          </a>
        </div>

        <p className="user-rol">{usuario?.rol}</p>

        {error && (
          <div className="warning-message">
            <p>⚠️ {error} (mostrando datos limitados)</p>
          </div>
        )}

        <div className="profile-content">
          {/* Datos personales - visible para todos */}
          <div className="profile-card">
            <h3>Datos Personales</h3>
            <div className="Texto-Data">
              <FaAddressCard/> <strong>DNI:</strong>
              <p> {usuario?.dni || "No disponible"}</p>
            </div>
            <div className="Texto-Data">
              <FaMobileAlt/> <strong>Celular:</strong>
              <p> {usuario?.celular || "No disponible"}</p>
            </div>
          </div>

          {/* Cuota - solo alumnos */}
          {isAlumno && (
            <div className="profile-card">
              <h3>Estado de Cuota</h3>
              <div className="Texto-Data">
                <p className="cuota-inactiva">
                  <GoAlertFill /> Información de cuota no disponible temporalmente
                </p>
              </div>
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