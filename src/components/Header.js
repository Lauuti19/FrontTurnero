import { Link } from 'react-router-dom';
import CTAButton from './CTAButton';
import '../styles/Header.css';
import { useAuth } from "../AuthContext";

const Header = () => {
  const { usuario } = useAuth();

  return (
    <header className="header">
      <nav className="nav">
        <a href="/" className="nav-link">Inicio</a>
        <a href="/disciplinas" className="nav-link">Disciplinas</a>
        <a href="/sobrenosotros" className="nav-link">Sobre Nosotros</a>
        <a href="/contacto" className="nav-link">Contacto</a>

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
