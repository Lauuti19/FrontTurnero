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
  const { getToken, usuario: usuarioAuth } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [cuota, setCuota] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    
    console.log("=== DEBUG TOKEN ===");
    console.log("Token completo:", token);
    console.log("Longitud del token:", token?.length);
    console.log("Token empieza con eyJ?:", token?.startsWith('eyJ'));
    console.log("Usuario en AuthContext:", usuarioAuth);
    console.log("===================");
    
    if (!token) {
      setError('No se encontró el token de autenticación.');
      setLoading(false);
      return;
    }

    // Verifica si el token es válido antes de hacer la petición
    if (!token.startsWith('eyJ')) {
      setError('Token inválido. Por favor, inicia sesión nuevamente.');
      setLoading(false);
      return;
    }

    fetch(`https://backturnero.onrender.com/api/auth/perfil`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(async (res) => {
        console.log("Status:", res.status);
        console.log("Headers:", Object.fromEntries(res.headers.entries()));
        
        if (res.status === 403) {
          const errorText = await res.text();
          console.log("Respuesta de error 403:", errorText);
          throw new Error('Acceso denegado. Token puede estar expirado o inválido.');
        }
        if (!res.ok) {
          throw new Error(`Error ${res.status} al obtener los datos del usuario.`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Datos recibidos del perfil:", data);
        
        if (data.usuario) {
          const usuarioCompleto = {
            id_usuario: data.usuario.id,
            email: data.usuario.email,
            nombre: data.usuario.nombre,
            id_rol: data.usuario.id_rol,
            rol: data.usuario.id_rol === 1 ? "Administrador" : 
                 data.usuario.id_rol === 2 ? "Profesor" : "Alumno",
            dni: usuarioAuth?.dni || "No disponible",
            celular: usuarioAuth?.celular || "No disponible"
          };
          setUsuario(usuarioCompleto);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error completo:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [getToken, usuarioAuth]);

  // Si tenemos usuario en AuthContext pero no pudimos cargar el perfil, usamos esos datos
  useEffect(() => {
    if (usuarioAuth && !usuario && !loading) {
      console.log("Usando datos de AuthContext:", usuarioAuth);
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
    }
  }, [usuarioAuth, usuario, loading]);

  if (loading) {
    return (
      <div className="loading-container">
        <span className="loader"></span>
        <h1>DRAKKAR</h1>
      </div>
    );
  }

  if (error) {
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

        <div className="profile-content">
          {/* Datos personales - visible para todos */}
          <div className="profile-card">
            <h3>Datos Personales</h3>
            <div className="Texto-Data"><FaAddressCard/> <strong>DNI:</strong><p> {usuario?.dni || "No disponible"}</p></div>
            <div className="Texto-Data"><FaMobileAlt/> <strong>Celular:</strong><p> {usuario?.celular || "No disponible"}</p></div>
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