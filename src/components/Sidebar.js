import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../styles/Sidebar.css';
import { useAuth } from "../AuthContext";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showGestionSubmenu, setShowGestionSubmenu] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  useEffect(() => {
    setIsOpen(false); 
  }, [location.pathname]);

  if (!usuario) return null; 

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  let content;
  if (usuario.id_rol === 1) {
    content = (
      <div className='OpcionesSidebar'>
        <Link to="/perfil" className='OpcionSidebar'>Perfil</Link>
        <Link to="/clasesTodos" className='OpcionSidebar'>Clases</Link>

       <div className="sb-group">
          <button
            className='OpcionSidebar'
            onClick={() => setShowGestionSubmenu(prev => !prev)}
            type="button"
            id="boton-gestion"
          >
            Gestión
            {showGestionSubmenu ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </button>
          {showGestionSubmenu && (
            <div className={`sb-submenu ${showGestionSubmenu ? 'open' : ''}`}>
              <Link to="/manager/clases"><button className="sb-submenu-item">Clases</button></Link>
              <Link to="/manager/planes"><button className="sb-submenu-item">Planes</button></Link>
              <Link to="/manager/disciplinas"><button className="sb-submenu-item">Disciplinas</button></Link>
              <Link to="/manager/usuarios"><button className="sb-submenu-item">Usuarios</button></Link>
              <Link to="/manager/rutinas"><button className="sb-submenu-item">Rutinas</button></Link>
              <Link to="registrar-cuota"><button className="sb-submenu-item">Cuotas</button></Link>
              <Link to="/manager/ejercicios"><button className="sb-submenu-item">Ejercicios</button></Link>
            </div>
          )}
        </div>


        <Link to="/timer" className='OpcionSidebar'>Timer</Link>
        <Link to="/rutinas" className='OpcionSidebar'>Rutinas</Link>

        <button onClick={handleLogout} className='LogOutBTN'>Cerrar Sesion</button>
      </div>
    );
  } else if (usuario.id_rol === 2) {
    content = (
      <div className='OpcionesSidebar'>
        <Link to="/perfil" className='OpcionSidebar'>Perfil</Link>
        <Link to="/clasesTodos" className='OpcionSidebar'>Clases</Link>
        <Link to="#" className='OpcionSidebar'>Agenda</Link>

        <div className="sb-group">
          <button
            className='OpcionSidebar'
            onClick={() => setShowGestionSubmenu(prev => !prev)}
            type="button"
          >
            Gestión
            {showGestionSubmenu ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </button>
          {showGestionSubmenu && (
            <div className={`sb-submenu ${showGestionSubmenu ? 'open' : ''}`}>
              <Link to="/manager/clases"><button className="sb-submenu-item">Clases</button></Link>
              <Link to="/manager/planes"><button className="sb-submenu-item">Planes</button></Link>
              <Link to="/manager/disciplinas"><button className="sb-submenu-item">Disciplinas</button></Link>
              <Link to="/manager/usuarios"><button className="sb-submenu-item">Usuarios</button></Link>
              <Link to="/manager/rutinas"><button className="sb-submenu-item">Rutinas</button></Link>
              <Link to="registrar-cuota"><button className="sb-submenu-item">Cuotas</button></Link>
              <Link to="/manager/ejercicios"><button className="sb-submenu-item">Ejercicios</button></Link>
            </div>
          )}
        </div>

        <Link to="/timer" className='OpcionSidebar'>Timer</Link>
        <button onClick={handleLogout} className='LogOutBTN'>Cerrar Sesion</button>
      </div>
    );
  } else if (usuario.id_rol === 3) {
    content = (
      <div className='OpcionesSidebar'>
        <Link to="perfil" className='OpcionSidebar'>Mi Perfil</Link>
        <Link to="/clasesUser" className='OpcionSidebar'>Clases</Link>
        <Link to="#" className='OpcionSidebar'>Progreso</Link>
        <Link to="/timer" className='OpcionSidebar'>Timer</Link>
        <Link to="/rutina" className='OpcionSidebar'>Mi Rutina</Link>

        <button onClick={handleLogout} className='LogOutBTN'>Cerrar Sesion</button>
      </div>
    );
  }

  return (
    <div>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={toggleSidebar}
          aria-label="Cerrar menú"
        />
      )}
      <button
        onClick={toggleSidebar}
        className={`toggle-button${isOpen ? " open" : ""}`}
        style={{
          left: isOpen ? 260 : 0,
          transition: 'left 0.3s cubic-bezier(.77,0,.18,1)'
        }}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        <span style={{
          fontSize: "2rem",
          color: isOpen ? "#fbf106" : "#232526",
          transition: "color 0.3s, transform 0.3s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%"
        }}>
          {isOpen ? "" : "☰"}
        </span>
      </button>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <h2>Opciones</h2>
        {content}
        
      </div>
    </div>
  );
};

export default Sidebar;
