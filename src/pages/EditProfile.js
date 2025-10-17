import React, { useEffect, useState } from 'react';
import '../styles/UserProfile.css';
import { useAuth } from '../AuthContext';
import Swal from 'sweetalert2';
import { getFullUserData } from '../services/userService'; // Importar el servicio

const EditProfile = () => {
  const { getUserId, getToken } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    celular: '',
    dni: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id_usuario = getUserId();
    const token = getToken();
    
    if (!id_usuario || !token) {
      setError('No hay sesión activa');
      setLoading(false);
      return;
    }

    // Usar el servicio getFullUserData en lugar de fetch directo
    getFullUserData(token, id_usuario)
      .then(data => {
        // El servicio ya combina datos de perfil y usuario
        setFormData({
          nombre: data.nombre || '',
          email: data.email || '',
          celular: data.celular || '',
          dni: data.dni || ''
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error obteniendo datos:', err);
        setError(err.message || 'No se pudieron cargar los datos del usuario.');
        setLoading(false);
      });
  }, [getUserId, getToken]);

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

    try {
      const res = await fetch(`https://backturnero-vvk6.onrender.com/api/usuarios/update`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, id_usuario })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al actualizar el perfil.');
      }
      
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
    }
  };

  const handleChangePassword = async () => {
    let errorMsg = '';
    let result;
    const token = getToken();
    
    if (!token) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No hay token de autenticación disponible.'
      });
      return;
    }

    do {
      result = await Swal.fire({
        title: 'Cambiar contraseña',
        html:
          `<input type="password" id="old-password" class="swal2-input" placeholder="Contraseña actual"/>
          <div id="error-msg" style="color:red;font-size:0.9em;text-align:left;margin-top:-10px;">${errorMsg}</div>
          <input type="password" id="new-password" class="swal2-input" placeholder="Nueva contraseña"/>`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Cambiar',
        cancelButtonText: 'Cancelar',
        preConfirm: async () => {
          const oldPassword = document.getElementById('old-password').value;
          const newPassword = document.getElementById('new-password').value;
          
          if (!oldPassword || !newPassword) {
            Swal.showValidationMessage('Complete ambos campos');
            return false;
          }
          
          if (newPassword.length < 6) {
            Swal.showValidationMessage('La nueva contraseña debe tener al menos 6 caracteres');
            return false;
          }

          try {
            const res = await fetch('https://backturnero-vvk6.onrender.com/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: formData.email, password: oldPassword })
            });
            
            if (!res.ok) {
              Swal.showValidationMessage('La contraseña actual es incorrecta.');
              return false;
            }
          } catch (err) {
            Swal.showValidationMessage('Error de conexión');
            return false;
          }
          
          return { oldPassword, newPassword };
        }
      });

      if (result.isConfirmed && result.value) {
        const { newPassword } = result.value;
        try {
          const id_usuario = getUserId();
          const res = await fetch('https://backturnero-vvk6.onrender.com/api/auth/update-password', {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id_usuario, nuevaPassword: newPassword })
          });
          
          if (!res.ok) {
            const errorData = await res.json();
            errorMsg = errorData.message || 'Error al cambiar la contraseña';
          } else {
            await Swal.fire({
              icon: 'success',
              title: 'Contraseña actualizada',
              showConfirmButton: false,
              timer: 1500
            });
            errorMsg = '';
            break;
          }
        } catch (err) {
          errorMsg = 'Error de conexión al cambiar la contraseña';
        }
      } else {
        break;
      }
    } while (errorMsg);
  };

  //if (loading) return (
  //  <div className="edit-user-container">
  //    <div className="edit-user-box">
  //      <p>Cargando datos...</p>
  //    </div>
  //  </div>
  //);
  
  if (error) return (
    <div className="edit-user-container">
      <div className="edit-user-box">
        <p className="error-message">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="botonGuardarPerfil"
        >
          Reintentar
        </button>
      </div>
    </div>
  );

  return (
    <div className="edit-user-container">
      <div className="edit-user-box">
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
          <button type="button" className="botonClave" onClick={handleChangePassword}>
            Cambiar contraseña
          </button>
          
          <button type="submit" className="botonGuardarPerfil">
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;