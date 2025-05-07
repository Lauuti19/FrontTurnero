import { Link } from 'react-router-dom';
import CTAButton from './CTAButton';
import '../styles/Header.css';

const Header = () => {
    return(
        <div>
        <header className="header">
          <nav className="nav">
            <a href="/" className="nav-link">Inicio</a>
            <a href="/" className="nav-link">Disciplinas</a>
            <a href="/" className="nav-link">Sobre Nosotros</a>
            <a href="/" className="nav-link">Contacto</a>
            <Link to="/login">
            <CTAButton text="Login"  className="btn-lgn"/>
            </Link>
          </nav>
        </header>
      </div>
    )
}

export default Header;