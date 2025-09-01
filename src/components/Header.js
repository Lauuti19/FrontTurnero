import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CTAButton from './CTAButton';
import '../styles/Header.css';
import { useAuth } from "../AuthContext";

const Header = () => {
  const { usuario } = useAuth();
  const [creditos, setCreditos] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreditos = async () => {
      if (usuario?.id_usuario || usuario?.id) {
        const id_usuario = usuario.id_usuario || usuario.id;
        setCreditos(null); // Resetea créditos 
        try {
          const res = await fetch(`http://localhost:3001/api/payments/active-fees/?id_usuario=${id_usuario}`);
          const data = await res.json();
          // Cambia aquí para usar el campo correcto
          const creditos = data.cuotas?.[0]?.creditos_disponibles_totales ?? 0;
          setCreditos(creditos);
        } catch {
          setCreditos(null);
        }
      }
    };
    fetchCreditos();
  }, [usuario]);

  return (
    <header className="header">
      <nav className="nav">
        <a href="/" className="nav-link">Inicio</a>
        <a href="/disciplinas" className="nav-link">Disciplinas</a>
        <a href="/sobrenosotros" className="nav-link">Sobre Nosotros</a>
        <a href="/contacto" className="nav-link">Contacto</a>

        {usuario && (
          <span
            className="creditos-header"
            style={{ cursor: "pointer" }}
            onClick={() => navigate('/comprar-creditos')}
            title="Comprar más créditos"
          >
            ₡ {creditos !== null ? creditos : '...'}
            <span className="tooltip-text">Créditos disponibles</span>
          </span>
        )}

        {!usuario && (
          <Link to="/login">
            <CTAButton text="Ingresar" className="btn-lgn" />
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
