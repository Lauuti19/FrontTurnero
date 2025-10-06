import React, { useEffect, useState } from 'react';
import '../styles/BuyCredits.css'; // <-- Agrega esta línea

const BuyCredits = () => {
  const [planes, setPlanes] = useState([]);

  useEffect(() => {
    const fetchPlanes = async () => {
      const res = await fetch('https://backturnero.onrender.com/api/planes');
      const data = await res.json();
      setPlanes(data.planes); // <-- usa la propiedad correcta
    };
    fetchPlanes();
  }, []);

  const handleComprar = async (plan) => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const id_usuario = usuario?.id_usuario || usuario?.id;
    await fetch('https://backturnero.onrender.com/api/cuotas/comprar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_usuario,
        id_plan: plan.id_plan,
        creditos_total: plan.creditos_total,
        creditos_disponibles: plan.creditos_total,
        monto: plan.monto
      })
    });
    alert('¡Compra realizada!');
  };

  return (
    <div className="buy-credits">
    <div className="buy-credits-container">
      <h2>Comprar Créditos</h2>
      <h1>
        <div>
        {planes.map(plan => (
          <div key={plan.id_plan}  className='ContenedorPlanes'>
            <strong>{plan.nombre}</strong> <h4>{plan.descripcion}</h4><h3 id='credits'>₡ {plan.creditos_total} <p>(Créditos)</p></h3><h3> ARS${plan.monto}</h3>
            <button  onClick={() => handleComprar(plan)}>Comprar</button>
          </div>
        ))}
        </div>
      </h1>
    </div>
    </div>
  );
};

export default BuyCredits;