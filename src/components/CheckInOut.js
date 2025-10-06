import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import Swal from 'sweetalert2';

const hoyISO = () => new Date().toISOString().slice(0,10);

export default function CheckInOut() {
  const { getUserId } = useAuth();
  const [accion, setAccion] = useState('CHECK_IN');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const id_usuario = getUserId();
  const fechaHoy = hoyISO();

  const refresh = () => {
    setLoading(true);
    fetch(`https://backturnero.onrender.com/api/workhours/check-status-dia?id_usuario=${id_usuario}&fecha=${fechaHoy}`)
      .then(r => r.json())
      .then(d => setAccion(d?.accion || 'CHECK_IN'))
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, []); 

  const registrar = async (tipo, fecha, hora) => {
    const endpoint = tipo === 'CHECK_IN'
      ? 'checkin'
      : 'checkout';

    try {
      await fetch(`https://backturnero.onrender.com/api/workhours/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ id_usuario, fecha, hora })
      });
      refresh();
      Swal.fire('¡Éxito!', `${tipo === 'CHECK_IN' ? 'Check-in' : 'Check-out'} registrado.`, 'success');
    } catch (e) {
      setErr(e.message);
      Swal.fire('Error', e.message, 'error');
    }
  };

  const confirmarAccion = (tipo) => {
    const horaActual = new Date().toTimeString().slice(0,8);

    Swal.fire({
      title: `¿Confirmás ${tipo === 'CHECK_IN' ? 'el Check-in' : 'el Check-out'}?`,
      text: `Día: ${fechaHoy} - Hora: ${horaActual}`,
      showDenyButton: true,
      confirmButtonText: 'Confirmar',
      denyButtonText: 'Editar hora/fecha',
    }).then((result) => {
      if (result.isConfirmed) {
        registrar(tipo, fechaHoy, horaActual);
      } else if (result.isDenied) {
        Swal.fire({
          title: 'Editar hora y fecha',
          html: `
            <input type="date" id="fecha" class="swal2-input" value="${fechaHoy}">
            <input type="time" id="hora" class="swal2-input" value="${horaActual}">
          `,
          focusConfirm: false,
          preConfirm: () => {
            const fecha = document.getElementById('fecha').value;
            const hora = document.getElementById('hora').value;
            if (!fecha || !hora) {
              Swal.showValidationMessage('Debes ingresar fecha y hora');
              return false;
            }
            return { fecha, hora };
          }
        }).then((res) => {
          if (res.isConfirmed) {
            registrar(tipo, res.value.fecha, res.value.hora);
          }
        });
      }
    });
  };

  if (loading) return <p>Cargando asistencia de hoy…</p>;
  if (err) return <p style={{color:'crimson'}}>Error: {err}</p>;

  return (
    <div>
      <h3>Asistencia de hoy</h3>
      {accion === 'CHECK_IN' && (
        <button className="botonGuardarPerfil" onClick={() => confirmarAccion('CHECK_IN')}>
          Marcar Check-in
        </button>
      )}
      {accion === 'CHECK_OUT' && (
        <button className="botonGuardarPerfil" onClick={() => confirmarAccion('CHECK_OUT')}>
          Marcar Check-out
        </button>
      )}
    </div>
  );
}
