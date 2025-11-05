import React from 'react';
import '../styles/ExpiredTokenPage.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import barquito from '../assets/barquito-drakkar.png';
const ExpiredTokenPage = () => {

    const navigate = useNavigate();
    const { logout } = useAuth();

    return (
    <div className="expired-token-container">
        <div className="expired-token-box">
            <img src={barquito} alt="Barquito Drakkar" className="expired-token-icon" />
            <h2 className="expired-token-title">Token Expirado</h2>
            <p className="expired-token-message">
                Su sesión ha expirado. Por favor, inicie sesión nuevamente para continuar.
            </p>
                        <button
                                className="expired-token-button"
                                onClick={() => {
                                    try {
                                        // Ejecutar cierre de sesión y redirigir
                                        if (typeof logout === 'function') logout();
                                    } catch (e) {
                                        // Ignorar errores de logout y continuar con la navegación
                                        console.error('Error al ejecutar logout:', e);
                                    }
                                    navigate('/login');
                                }}
                        >
                Ir a la página de inicio de sesión
            </button>
        </div>
    </div>
    );
};
export default ExpiredTokenPage;