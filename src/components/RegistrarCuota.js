import React, { useState, useEffect } from 'react';
import '../styles/RegistrarCuota.css';

const RegistrarCuota = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null); // objeto usuario
  const [planes, setPlanes] = useState([]);
  const [idPlan, setIdPlan] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [pagado, setPagado] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Buscar usuarios
  useEffect(() => {
    if (nombreUsuario.length >= 1) {
      fetch(`https://backturnero.onrender.com/api/usuarios/buscar?nombre=${nombreUsuario}`)
        .then(res => res.json())
        .then(data => {
          setUsuarios(Array.isArray(data) ? data : data.usuarios || []);
        });
      setShowSuggestions(true);
    } else {
      setUsuarios([]);
      setShowSuggestions(false);
    }
  }, [nombreUsuario]);

  // Obtener planes
  useEffect(() => {
    fetch('https://backturnero.onrender.com/api/planes')
      .then(res => res.json())
      .then(data => setPlanes(data.planes || []));
  }, []);

  const handleUsuarioClick = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setNombreUsuario(usuario.nombre);
    setShowSuggestions(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!usuarioSeleccionado || !idPlan || !metodoPago) {
      alert('Completa todos los campos');
      return;
    }

    await fetch('https://backturnero.onrender.com/api/payments/register-fee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_usuario: usuarioSeleccionado.id_usuario,
        id_plan: idPlan,
        metodo_pago: metodoPago,
        pagado: pagado
      })
    });

    alert('Cuota registrada');
    setNombreUsuario('');
    setUsuarioSeleccionado(null);
    setIdPlan('');
    setMetodoPago('');
    setPagado(false);
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
                setUsuarioSeleccionado(null);
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
                    onClick={() => handleUsuarioClick(u)}
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

          <label>Método de pago</label>
          <select
            name="metodo_pago"
            value={metodoPago}
            onChange={e => setMetodoPago(e.target.value)}
            required
          >
            <option value="">Selecciona un método</option>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
          </select>

          <label>
            <input
              type="checkbox"
              checked={pagado}
              onChange={e => setPagado(e.target.checked)}
            />
            ¿Está pagado?
          </label>

          <button type="submit">Registrar</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrarCuota;
