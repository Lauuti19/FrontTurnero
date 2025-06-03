import React, { useEffect, useState } from 'react';
import '../styles/UserProfile.css';
import { useAuth } from '../AuthContext';

const EditProfile = () => {
  const { getUserId } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    celular: '',
    dni: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

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
        const { email, celular, dni } = data.datos_usuario;
        setFormData({ email, celular, dni });
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [getUserId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id_usuario = getUserId();
    try {
      const res = await fetch(`http://localhost:3001/api/usuarios/${id_usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Error al actualizar el perfil.');

      setSuccessMessage('Perfil actualizado correctamente.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="register-user-container"><p>Cargando datos...</p></div>;
  if (error) return <div className="register-user-container"><p>{error}</p></div>;

  return (
    <div className="register-user-container">
      <div className="register-user-box">
        <h2 className="register-user-title">Modificar Información</h2>
        <form className="user-form-edit" onSubmit={handleSubmit}>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>DNI:</label>
          <input type="text" name="dni" value={formData.dni} onChange={handleChange} required />

          <label>Celular:</label>
          <input type="text" name="celular" value={formData.celular} onChange={handleChange} required />

          <label>Contraseña:</label>
          <input type="password" name="contraseña" value={"***********"} onChange={handleChange} disabled />

          <button type="submit" className="botonGuardarPerfil">Guardar cambios</button>
          {successMessage && <p className="mensajeExito">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
