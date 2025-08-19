import React, { useEffect, useState } from 'react';
import { FiSliders } from "react-icons/fi";
import '../styles/UserProfile.css';
import transition from '../transition'
import { useAuth } from '../AuthContext'; 

const UserProfile = () => {
  const { getUserId } = useAuth(); // <-- Usamos el contexto aquí
  const [usuario, setUsuario] = useState(null);
  const [cuota, setCuota] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id_usuario = getUserId(); // <-- Obtenemos el ID del usuario

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
      <div className='separador-user'>
        <div className="user-form">
          <p className='user-mail'> {usuario.email}</p>
          <p className='user-rol'>{usuario.rol}</p>
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
              <>
                <div className='cuota-info'>
                  <p><strong>Plan:</strong> {cuota.nombre_plan}</p>
                  <p><strong>Fecha de Pago:</strong> {cuota.fecha_pago}</p>
                  <p><strong>Vencimiento:</strong> {cuota.fecha_vencimiento}</p>
                  <p><strong>Estado de Pago:</strong> {cuota.estado_pago}</p>
                  <p><strong>Créditos Totales:</strong> {cuota.creditos_total}</p>
                  <p><strong>Créditos Disponibles:</strong> {cuota.creditos_disponibles}</p>
                </div>
              </>
            ) : (
              <div className='cuota-info'>
                <p className='cuota-inactiva'>
                  ⚠ No tiene una cuota activa. Por favor, renueve su plan.
                </p>
              </div>
            )}
          </div>
        </div>
        <div className='Derecha'>
          <a href='/editar'><FiSliders /></a>
          <div className='records'>
            <h2>Records</h2>
            <div className='contenido-record'>
              <p>Mejor peso en x ejercicio:10kg</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default transition(UserProfile);
