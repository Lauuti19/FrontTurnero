import React, { useState, useEffect, useRef } from "react";
import '../styles/Buscador.css';
import { useAuth } from '../AuthContext';

const Buscador = ({ onUsuarioSeleccionado, disabled = false }) => {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const suggestionsRef = useRef(null);
    const ignoreNextSearch = useRef(false);
    const { getToken } = useAuth();

    useEffect(() => {
        if (ignoreNextSearch.current) {
            ignoreNextSearch.current = false;
            return;
        }
        
        if (nombreUsuario.length >= 2) {
            setLoading(true);
            const token = getToken();
            
            if (!token) {
                console.error("No hay token disponible");
                setLoading(false);
                return;
            }

            fetch(`https://backturnero-vvk6.onrender.com/api/usuarios/buscar?nombre=${encodeURIComponent(nombreUsuario)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`Error ${res.status}: ${res.statusText}`);
                    }
                    return res.json();
                })
                .then(data => {
                    setUsuarios(Array.isArray(data) ? data : data.usuarios || []);
                })
                .catch(error => {
                    console.error("Error buscando usuarios:", error);
                    setUsuarios([]);
                })
                .finally(() => {
                    setLoading(false);
                    setShowSuggestions(true);
                });
        } else {
            setUsuarios([]);
            setShowSuggestions(false);
            setLoading(false);
        }
    }, [nombreUsuario, getToken]);

    // Cerrar sugerencias cuando se hace click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleUsuarioClick = (usuario) => {
        ignoreNextSearch.current = true; 
        setNombreUsuario(usuario.nombre);
        setShowSuggestions(false);
        onUsuarioSeleccionado(usuario);
    };

    const handleInputChange = (e) => {
        setNombreUsuario(e.target.value);
        onUsuarioSeleccionado(null);
    };

    const handleInputFocus = () => {
        if (nombreUsuario.length >= 2 && usuarios.length > 0) {
            setShowSuggestions(true);
        }
    };

    const handleClear = () => {
        setNombreUsuario('');
        setUsuarios([]);
        setShowSuggestions(false);
        onUsuarioSeleccionado(null);
    };

    return (
        <div className="buscador-container" ref={suggestionsRef}>
            <div className="buscador-input-wrapper">
                <input
                    name="nombre_usuario"
                    value={nombreUsuario}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    placeholder="Buscar usuario por nombre..."
                    autoComplete="off"
                    className="buscador-input"
                    disabled={disabled}
                />
                {nombreUsuario && (
                    <button 
                        type="button" 
                        className="buscador-clear-btn"
                        onClick={handleClear}
                        disabled={disabled}
                    >
                        ×
                    </button>
                )}
            </div>

            {loading && (
                <div className="buscador-loading">
                    <div className="buscador-spinner"></div>
                    Buscando usuarios...
                </div>
            )}

            {showSuggestions && usuarios.length > 0 && (
                <div className="buscador-suggestions">
                    <div className="buscador-suggestions-header">
                        <span>{usuarios.length} usuario{usuarios.length !== 1 ? 's' : ''} encontrado{usuarios.length !== 1 ? 's' : ''}</span>
                    </div>
                    {usuarios.map(usuario => (
                        <div
                            key={usuario.id_usuario}
                            onClick={() => handleUsuarioClick(usuario)}
                            className="buscador-suggestion-item"
                        >
                            <div className="buscador-suggestion-content">
                                <span className="buscador-suggestion-name">
                                    {usuario.nombre} {usuario.apellido || ''}
                                </span>
                                <div className="buscador-suggestion-details">
                                    <span className="buscador-suggestion-email">{usuario.dni}</span>
                                    {usuario.rol && (
                                        <span className="buscador-suggestion-role">{usuario.rol.nombre}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showSuggestions && !loading && usuarios.length === 0 && nombreUsuario.length >= 2 && (
                <div className="buscador-no-results">
                    <div className="buscador-no-results-icon">🔍</div>
                    <div className="buscador-no-results-text">
                        <p>No se encontraron usuarios</p>
                        <span>Intenta con otro nombre</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Buscador;