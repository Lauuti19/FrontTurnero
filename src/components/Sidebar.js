import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../styles/Sidebar.css';
import { useAuth } from "../AuthContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
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
        <Link to="/registerUser" className='OpcionSidebar'>Registrar Usuario</Link>
        <Link to="/clasesTodos" className='OpcionSidebar'>Clases</Link>
        <Link to="#" className='OpcionSidebar'>Usuarios</Link>
        <Link to="#" className='OpcionSidebar'>Reportes</Link>
        <Link to="#" className='OpcionSidebar'>Configuracion</Link>
        <button onClick={handleLogout} className='LogOutBTN'>Cerrar Sesion</button>
      </div>
    );
  } else if (usuario.id_rol === 2) {
    content = (
      <div className='OpcionesSidebar'>
        <Link to="/clasesTodos" className='OpcionSidebar'>Clases</Link>
        <Link to="#" className='OpcionSidebar'>Alumnos</Link>
        <Link to="#" className='OpcionSidebar'>Agenda</Link>
        <Link to="#" className='OpcionSidebar'>Configuracion</Link>
        <button onClick={handleLogout} className='LogOutBTN'>Cerrar Sesion</button>
      </div>
    );
  } else if (usuario.id_rol === 3) {
    content = (
      <div className='OpcionesSidebar'>
        <Link to="/clasesTodos" className='OpcionSidebar'>Clases</Link>
        <Link to="#" className='OpcionSidebar'>Mi Perfil</Link>
        <Link to="#" className='OpcionSidebar'>Progreso</Link>
        <Link to="#" className='OpcionSidebar'>Configuracion</Link>
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
          {isOpen ? "✕" : "☰"}
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
