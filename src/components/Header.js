import { Link, useNavigate } from 'react-router-dom';
import CTAButton from './CTAButton';
import '../styles/Header.css';
import { useAuth } from "../AuthContext";

const Header = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <nav className="nav">
        <a href="/" className="nav-link">Inicio</a>
        <a href="/" className="nav-link">Disciplinas</a>
        <a href="/" className="nav-link">Sobre Nosotros</a>
        <a href="/" className="nav-link">Contacto</a>

        {usuario ? (
          <CTAButton text="Cerrar Sesion" onClick={handleLogout}/>
        ) : (
          <Link to="/login">
            <CTAButton text="Ingresar" className="btn-lgn" />
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
