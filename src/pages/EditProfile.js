// components/EditProfile.jsx
import React, { useEffect, useState } from 'react';
import '../styles/UpdateProfile.css';
import { useAuth } from '../AuthContext';
import Swal from 'sweetalert2';
import { useUsers, useAuth as useAuthHook } from '../hooks';
import SkeletonLoader from '../components/SkeletonLoader';
import { IoIosExit } from "react-icons/io";
import { Link } from 'react-router-dom';


const EditProfile = () => {
  const { getUserId, getToken } = useAuth();
  const { getFullUserData, updateUserInfo, loading: usersLoading, error: usersError } = useUsers();
  const { updatePassword, login, loading: authLoading } = useAuthHook();
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    celular: '',
    dni: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      const id_usuario = getUserId();
      const token = getToken();
      
      if (!id_usuario || !token) {
        setError('No hay sesión activa');
        setLoading(false);
        return;
      }

      try {
        const data = await getFullUserData(token, id_usuario);
        setFormData({
          nombre: data.nombre || '',
          email: data.email || '',
          celular: data.celular || '',
          dni: data.dni || ''
        });
        setLoading(false);
      } catch (err) {
        console.error('Error obteniendo datos:', err);
        setError(err.message || 'No se pudieron cargar los datos del usuario.');
        setLoading(false);
      }
    };

    loadUserData();
  }, [getUserId, getToken, getFullUserData]);

  const renderSkeletonEdit = () => {
    return (
      <div className="edit-user-container">
        <div className="edit-user-box">
          <SkeletonLoader 
            type="text" 
            height="40px" 
            width="200px" 
            className="edit-skeleton-title"
          />
          
          <div className="edit-user-form">
            {/* Información personal skeleton */}
            <SkeletonLoader 
              type="text" 
              height="30px" 
              width="180px" 
              className="edit-skeleton-section-title"
            />
            
            <SkeletonLoader type="text" height="20px" width="80px" />
            
            <SkeletonLoader type="text" height="20px" width="80px" />
            
            <div className="fila-edit">
              <div className="bloque-edit">
                <SkeletonLoader type="text" height="20px" width="60px" />
              </div>
              <div className="bloque-edit">
                <SkeletonLoader type="text" height="40px" width="100%" />
              </div>
            </div>
            
            <SkeletonLoader type="text" height="16px" width="100%" />
            
            <SkeletonLoader 
              type="text" 
              height="45px" 
              width="180px" 
              className="edit-skeleton-password-button"
            />

            <SkeletonLoader 
              type="text" 
              height="50px" 
              width="100%" 
              className="edit-skeleton-button"
            />
          </div>
        </div>
      </div>
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id_usuario = getUserId();
    const token = getToken();
    
    if (!token) {
      setError('No hay token de autenticación disponible.');
      return;
    }

    setSubmitting(true);
    try {
      await updateUserInfo(token, { ...formData, id_usuario });
      
      await Swal.fire({
        icon: 'success',
        title: 'Perfil actualizado',
        showConfirmButton: false,
        timer: 1500
      });
      setError(null);
    } catch (err) {
      setError(err.message);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePassword = async () => {
    const token = getToken();
    const id_usuario = getUserId();
    
    if (!token || !id_usuario) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No hay sesión activa disponible.'
      });
      return;
    }

    let shouldContinue = true;
    
    while (shouldContinue) {
      const result = await Swal.fire({
        title: 'Cambiar contraseña',
        html:
          `<input type="password" id="old-password" class="swal2-input" placeholder="Contraseña actual"/>
          <input type="password" id="new-password" class="swal2-input" placeholder="Nueva contraseña"/>`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Cambiar',
        cancelButtonText: 'Cancelar',
        preConfirm: async () => {
          const oldPassword = document.getElementById('old-password')?.value;
          const newPassword = document.getElementById('new-password')?.value;
          
          if (!oldPassword || !newPassword) {
            Swal.showValidationMessage('Complete ambos campos');
            return false;
          }
          
          if (newPassword.length < 6) {
            Swal.showValidationMessage('La nueva contraseña debe tener al menos 6 caracteres');
            return false;
          }

          try {
            await login({ email: formData.email, password: oldPassword });
          } catch (err) {
            Swal.showValidationMessage('La contraseña actual es incorrecta.');
            return false;
          }
          
          return { oldPassword, newPassword };
        }
      });

      if (result.isConfirmed && result.value) {
        const { newPassword } = result.value;
        try {
          // ✅ CORREGIDO: Usar hook updatePassword
          await updatePassword(token, { id_usuario, nuevaPassword: newPassword });
          
          await Swal.fire({
            icon: 'success',
            title: 'Contraseña actualizada',
            showConfirmButton: false,
            timer: 1500
          });
          shouldContinue = false;
        } catch (err) {
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.message || 'Error al cambiar la contraseña'
          });
        }
      } else {
        shouldContinue = false;
      }
    }
  };

  const combinedLoading = loading || usersLoading;

  if (combinedLoading) {
    return renderSkeletonEdit();
  }
  
  if (error || usersError) {
    return (
      <div className="edit-user-container">
        <div className="edit-user-box">
          <p className="error-message">{error || usersError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="botonGuardarPerfil"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-user-container">
      <div className="edit-user-box">
        <Link to='/perfil'>
          <div className='back-in-edit'>
            <IoIosExit /><p>Volver</p>
          </div>
        </Link>
        <h2 className="edit-user-title">Actualizar perfil</h2>
        <form className="edit-user-form" onSubmit={handleSubmit}>
          <h3>Información personal</h3>
          <label>Nombre:</label>
          <input 
            type="text" 
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
            required 
          />
          
          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          
          <div className='fila-edit'>
            <div className='bloque-edit'>
              <label>Celular:</label>
              <input 
                type="text" 
                name="celular" 
                value={formData.celular} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className='bloque-edit'>
              <label>DNI:</label>
              <input 
                type="text" 
                name="dni" 
                value={formData.dni} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          
          <h3>Actualiza tu contraseña</h3>
          <p>Por tu seguridad, te recomendamos: elegir una contraseña única que no uses para conectarte a otras cuentas.</p>
          <button 
            type="button" 
            className="botonClave" 
            onClick={handleChangePassword}
            disabled={authLoading}
          >
            {authLoading ? 'Cambiando...' : 'Cambiar contraseña'}
          </button>
          
          <button 
            type="submit" 
            className="botonGuardarPerfil"
            disabled={submitting}
          >
            {submitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;