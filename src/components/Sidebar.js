import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../styles/Sidebar.css';
import { useAuth } from "../AuthContext";
import { FaChevronDown, FaChevronUp, FaTimes, FaBars } from 'react-icons/fa';

// Configuración de menús por rol para mejor mantenimiento
const menuConfig = {
  1: { // Administrador
    items: [
      { path: "/perfil", label: "Perfil" },
      { path: "/clasesTodos", label: "Clases" },
      { 
        label: "Gestión", 
        submenu: [
          { path: "/manager/clases", label: "Clases" },
          { path: "/manager/planes", label: "Planes" },
          { path: "/manager/disciplinas", label: "Disciplinas" },
          { path: "/manager/usuarios", label: "Usuarios" },
          { path: "/manager/rutinas", label: "Rutinas" },
          { path: "/registrar-cuota", label: "Cuotas" },
          { path: "/manager/ejercicios", label: "Ejercicios" }
        ]
      },
      { path: "/timer", label: "Timer" },
      { path: "/Movimientos", label: "Movimientos" }
    ]
  },
  2: { // Profesor
    items: [
      { path: "/perfil", label: "Perfil" },
      { path: "/clasesTodos", label: "Clases" },
      { path: "/Movimientos", label: "Movimientos" },
      { path: "#", label: "Agenda" },
      { 
        label: "Gestión", 
        submenu: [
          { path: "/manager/clases", label: "Clases" },
          { path: "/manager/planes", label: "Planes" },
          { path: "/manager/disciplinas", label: "Disciplinas" },
          { path: "/manager/usuarios", label: "Usuarios" },
          { path: "/manager/rutinas", label: "Rutinas" },
          { path: "/registrar-cuota", label: "Cuotas" },
          { path: "/manager/ejercicios", label: "Ejercicios" }
        ]
      },
      { path: "/timer", label: "Timer" }
    ]
  },
  3: { // Alumno
    items: [
      { path: "/perfil", label: "Mi Perfil" },
      { path: "/clasesUser", label: "Clases" },
      { path: "#", label: "Progreso" },
      { path: "/timer", label: "Timer" },
      { path: "/rutina", label: "Mi Rutina" }
    ]
  }
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  // Cerrar sidebar al cambiar de ruta
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Cerrar sidebar al presionar Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const toggleSubmenu = useCallback((menuLabel) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [menuLabel]: !prev[menuLabel]
    }));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  if (!usuario) return null;

  const userMenu = menuConfig[usuario.id_rol];
  if (!userMenu) return null;

  const renderMenuItems = () => {
    return userMenu.items.map((item, index) => {
      if (item.submenu) {
        return (
          <div key={item.label} className="sb-group">
            <button
              className={`OpcionSidebar ${openSubmenus[item.label] ? 'active' : ''}`}
              onClick={() => toggleSubmenu(item.label)}
              type="button"
              aria-expanded={openSubmenus[item.label]}
              aria-controls={`submenu-${item.label}`}
            >
              {item.label}
              {openSubmenus[item.label] ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
            </button>
            {openSubmenus[item.label] && (
              <div 
                id={`submenu-${item.label}`}
                className={`sb-submenu ${openSubmenus[item.label] ? 'open' : ''}`}
              >
                {item.submenu.map(subItem => (
                  <Link 
                    key={subItem.path} 
                    to={subItem.path}
                    onClick={() => setIsOpen(false)}
                  >
                    <button className="sb-submenu-item">
                      {subItem.label}
                    </button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      }

      return (
        <Link 
          key={item.path} 
          to={item.path}
          className='OpcionSidebar'
          onClick={() => setIsOpen(false)}
        >
          {item.label}
        </Link>
      );
    });
  };

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={toggleSidebar}
          aria-label="Cerrar menú"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && toggleSidebar()}
        />
      )}
      
      <button
        onClick={toggleSidebar}
        className={`toggle-button ${isOpen ? "open" : ""}`}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={isOpen}
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>
      
      <aside 
        className={`sidebar ${isOpen ? 'open' : 'closed'}`}
        aria-hidden={!isOpen}
      >
        <div className="sidebar-header">
          <h2>Opciones</h2>
        </div>
        
        <nav className="sidebar-nav" aria-label="Navegación principal">
          <div className='OpcionesSidebar'>
            {renderMenuItems()}
          </div>
        </nav>

        <div className="sidebar-footer">
          <button 
            onClick={handleLogout} 
            className='LogOutBTN'
          >
            Cerrar Sesion
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;