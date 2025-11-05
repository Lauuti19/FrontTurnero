import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CTAButton from './CTAButton';
import '../styles/Header.css';
import { useAuth } from "../AuthContext";
import { fetchWithAuth } from '../services/api';

const Header = () => {
  const { usuario, creditos, getToken, getUserId, logout } = useAuth();
  const navigate = useNavigate();

  // Verificar si el usuario tiene rol de staff (1 o 2)
  const isStaff = usuario && (usuario.id_rol === 1 || usuario.id_rol === 2);

  // Comprobar validez del token mientras el Header está montado.
  // Si existe token pero el servidor responde 401, hacer logout y redirigir a /Expired.
  // Usamos un endpoint protegido ya existente (`/payments/active-fees`) porque requiere autenticación.
  // Esto evita redirigir a usuarios anónimos (sin token).
  useEffect(() => {
    let mounted = true;
    const validateToken = async () => {
      try {
        const token = typeof getToken === 'function' ? getToken() : null;
        if (!token) return; // sin token: no hacemos nada, permitimos acceso público

        const id = typeof getUserId === 'function' ? getUserId() : null;
        const endpoint = `/payments/active-fees${id ? `?id_usuario=${id}` : ''}`;

        // Intentar llamada protegida. Si falla con 401, tratamos como token expirado.
        await fetchWithAuth(endpoint, token, { method: 'GET' });
      } catch (err) {
        const msg = err?.message || '';
        if (/401|unauthorized|Unauthorized/i.test(msg)) {
          try {
            if (typeof logout === 'function') logout();
          } catch (e) {
            console.error('Error al ejecutar logout tras token inválido:', e);
          }
          if (mounted) navigate('/Expired');
        }
      }
    };

    validateToken();
    return () => { mounted = false; };
  }, [usuario, getToken, getUserId, logout, navigate]);

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