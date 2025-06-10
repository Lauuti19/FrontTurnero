import React, { useState, useEffect } from 'react';
import '../styles/RegistrarCuota.css';

const RegistrarCuota = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
  const [planes, setPlanes] = useState([]);
  const [idPlan, setIdPlan] = useState('');
  const [fechaPago, setFechaPago] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
  if (nombreUsuario.length > 1) {
    fetch(`http://localhost:3001/api/usuarios/buscar?nombre=${nombreUsuario}`)
      .then(res => res.json())
      .then(data => {
        console.log('Respuesta usuarios:', data); // <-- Agrega esto
        setUsuarios(data.usuarios || []);
      });
    setShowSuggestions(true);
  } else {
    setUsuarios([]);
    setShowSuggestions(false);
  }
}, [nombreUsuario]);

  // Obtener planes
  useEffect(() => {
    fetch('http://localhost:3001/api/planes')
      .then(res => res.json())
      .then(data => setPlanes(data.planes || []));
  }, []);

  const handleUsuarioClick = (nombre) => {
    setUsuarioSeleccionado(nombre);
    setNombreUsuario(nombre);
    setShowSuggestions(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!usuarioSeleccionado || !idPlan || !fechaPago) {
      alert('Completa todos los campos');
      return;
    }
    await fetch('http://localhost:3001/api/payments/registrar-cuota', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre_usuario: usuarioSeleccionado,
        id_plan: idPlan,
        fecha_pago: fechaPago
      })
    });
    alert('Cuota registrada');
    setNombreUsuario('');
    setUsuarioSeleccionado('');
    setIdPlan('');
    setFechaPago('');
  };

  return (
    <div className='registrar-cuota'>
      <h2>Registrar Cuota</h2>
      <div className="registrar-cuota-container">
        
        <form onSubmit={handleSubmit} autoComplete="off">
          <label>Buscar Usuario</label>
          <div style={{ position: 'relative' }}>
            
            <input
              name="nombre_usuario"
              value={nombreUsuario}
              onChange={e => {
                setNombreUsuario(e.target.value);
                setUsuarioSeleccionado('');
              }}
              placeholder="Nombre de usuario"
              required
              autoComplete="off"
              className='input-buscar-user'
            />
            {showSuggestions && usuarios.length > 0 && (
              <ul className="suggestions-list">
                {usuarios.map(u => (
                  <li
                    key={u.id_usuario}
                    onClick={() => handleUsuarioClick(u.nombre)}
                  >
                    {u.nombre}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <label>Plan seleccionado</label>
          <select
            name="id_plan"
            value={idPlan}
            onChange={e => setIdPlan(e.target.value)}
            required
          >
            <option value="">Selecciona un plan</option>
            {planes.map(plan => (
              <option key={plan.id_plan} value={plan.id_plan}>
                {plan.nombre}
              </option>
            ))}
          </select>
          <label>Fecha del pago</label>
          <input
            name="fecha_pago"
            type="date"
            value={fechaPago}
            onChange={e => setFechaPago(e.target.value)}
            required
          />
          <button type="submit">Registrar</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrarCuota;