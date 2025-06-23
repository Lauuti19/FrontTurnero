import React, { useEffect, useState } from 'react';
import '../styles/UserProfile.css';
import { useAuth } from '../AuthContext';
import Swal from 'sweetalert2';


const EditProfile = () => {
  const { getUserId } = useAuth();
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
        const { nombre, email, celular, dni } = data.datos_usuario;
        setFormData({ nombre, email, celular, dni });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [getUserId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id_usuario = getUserId();
    try {
      const res = await fetch(`http://localhost:3001/api/usuarios/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id_usuario })
      });
      if (!res.ok) throw new Error('Error al actualizar el perfil.');
      await Swal.fire({
        icon: 'success',
        title: 'Perfil actualizado',
        showConfirmButton: false,
        timer: 1500
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChangePassword = async () => {
    let errorMsg = '';
    let result;
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
          try {
            const res = await fetch('http://localhost:3001/api/auth/login', {
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
          const res = await fetch('http://localhost:3001/api/auth/update-password', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario, nuevaPassword: newPassword })
          });
          if (!res.ok) {
            errorMsg = 'Error al cambiar la contraseña';
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
          errorMsg = 'Error al cambiar la contraseña';
        }
      } else {
        break;
      }
    } while (errorMsg);
  };

  if (loading) return <div className="edit-user-container"><p>Cargando datos...</p></div>;
  if (error) return <div className="edit-user-container"><p>{error}</p></div>;

  return (
    <div className="edit-user-container">
      <div className="edit-user-box">
        <h2 className="edit-user-title">Actualizar perfil</h2>
        <form className="edit-user-form" onSubmit={handleSubmit}>
          <h3>información personal</h3>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          <div className='fila-edit'>
            <div className='bloque-edit'>
              <label>Celular:</label>
              <input type="text" name="celular" value={formData.celular} onChange={handleChange} required />
            </div>
            <div className='bloque-edit'>
              <label>DNI:</label>
              <input type="text" name="dni" value={formData.dni} onChange={handleChange} required />
            </div>
          </div>
          <h3>Actualiza tu contraseña</h3>
          <p>Por tu seguridad, te recomendamos: elegir una contraseña única que no uses para conectarte a otras cuentas.</p>
          <h3 className="botonClave" onClick={handleChangePassword}>Cambiar contraseña</h3>
          <button type="submit" className="botonGuardarPerfil">Guardar cambios</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

