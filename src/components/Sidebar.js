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
        <Link to="/registerUser"><h4 className='OpcionSidebar'>Registrar Usuario</h4></Link>
        <button onClick={handleLogout} className='LogOutBTN'>Cerrar Sesion</button>
      </div>
    );
  } else if (usuario.id_rol === 2) {
    content = (
      <div className='OpcionesSidebar'>
        <Link to="/clases"><h4 className='OpcionSidebar'>Clases</h4></Link>
        <button onClick={handleLogout} className='LogOutBTN'>Cerrar Sesion</button>
      </div>
    );
  } else if (usuario.id_rol === 3) {
    content = (
      <div className='OpcionesSidebar'>
        <Link to="/clasesUser"><h4 className='OpcionSidebar'>Clases</h4></Link>
        <button onClick={handleLogout} className='LogOutBTN'>Cerrar Sesion</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={toggleSidebar} className="toggle-button">
        
      </button>

      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <h2>Opciones</h2>
        {content}
      </div>
    </div>
  );
};

export default Sidebar;
