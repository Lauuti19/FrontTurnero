import { Link } from 'react-router-dom';
import '../styles/Header.css';
import LogoNuevo from '../assets/DrakkarMejor.png';
const Header = () => {
    return(
        <div>
        <header className="header">
          <img className="logo" src={LogoNuevo}></img>
          <nav className="nav">
            <a href="/" className="nav-link">Inicio</a>
            <a href="#" className="nav-link">Disciplinas</a>
            <a href="#" className="nav-link">Sobre Nosotros</a>
            <a href="#" className="nav-link">Contacto</a>
            <Link to="/login">
                <button className="login-btn">Login</button>
            </Link>
          </nav>
        </header>
      </div>
    )
}

export default Header;