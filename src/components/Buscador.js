import React, { useState, useEffect, useRef } from "react";
import { useAuth } from '../AuthContext'; // Importar el AuthContext

const Buscador = ({ onUsuarioSeleccionado }) => {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
    const [loading, setLoading] = useState(false);
    const suggestionsRef = useRef(null);
    const { getToken } = useAuth(); // Obtener la función getToken
    
    useEffect(() => {
        if (nombreUsuario.length >= 1) {
            setLoading(true);
            const token = getToken();
            
            if (!token) {
                console.error("No hay token disponible");
                setLoading(false);
                return;
            }

            fetch(`https://backturnero.onrender.com/api/usuarios/buscar?nombre=${nombreUsuario}`, {
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
        setUsuarioSeleccionado(usuario.nombre);
        setNombreUsuario(usuario.nombre);
        setShowSuggestions(false);
        onUsuarioSeleccionado(usuario); // Pasar el objeto completo del usuario
    };

    return (
        <div style={{ position: 'relative' }} ref={suggestionsRef}>
            <input
                name="nombre_usuario"
                value={nombreUsuario}
                onChange={e => {
                    setNombreUsuario(e.target.value);
                    setUsuarioSeleccionado('');
                    onUsuarioSeleccionado(null); // Limpiar selección al escribir
                }}
                onFocus={() => nombreUsuario.length >= 1 && setShowSuggestions(true)}
                placeholder="Nombre de usuario"
                required
                autoComplete="off"
                className='input-buscar-user'
            />
            
            {loading && (
                <div className="loading-suggestions">Buscando...</div>
            )}
            
            {showSuggestions && usuarios.length > 0 && (
                <ul className="suggestions-list">
                    {usuarios.map(u => (
                        <li
                            key={u.id_usuario}
                            onClick={() => handleUsuarioClick(u)} // Pasar el objeto completo
                        >
                            {u.nombre} {u.apellido && `- ${u.apellido}`} {/* Mostrar más info */}
                        </li>
                    ))}
                </ul>
            )}

            {showSuggestions && !loading && usuarios.length === 0 && nombreUsuario.length >= 1 && (
                <div className="no-results">No se encontraron usuarios</div>
            )}
        </div>
    );
}

export default Buscador;