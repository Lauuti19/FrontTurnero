import { Link, useNavigate } from 'react-router-dom';
import CTAButton from './CTAButton';
import '../styles/Header.css';
import { useAuth } from "../AuthContext";

const Header = () => {
  const { usuario, creditos } = useAuth();
  const navigate = useNavigate();

  // Verificar si el usuario tiene rol de staff (1 o 2)
  const isStaff = usuario && (usuario.id_rol === 1 || usuario.id_rol === 2);

  return (
    <header className="header">
      <nav className="nav">
        <a href="/" className="nav-link">Inicio</a>

        {usuario && (
          <span
            className="creditos-header"
            style={{ cursor: "pointer" }}
            onClick={() => isStaff ? null : navigate('/comprar-creditos')}
          >
            {isStaff ? 'Staff Mode' : `₡ ${creditos !== null ? creditos : '...'}`}
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