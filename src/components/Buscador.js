import React, { useState, useEffect, useRef } from "react";

const Buscador = ({ onUsuarioSeleccionado }) => {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
    const suggestionsRef = useRef(null);
    
    useEffect(() => {
        if (nombreUsuario.length >= 1) {
            fetch(`http://localhost:3001/api/usuarios/buscar?nombre=${nombreUsuario}`)
                .then(res => res.json())
                .then(data => {
                    setUsuarios(Array.isArray(data) ? data : data.usuarios || []);
                });
            setShowSuggestions(true);
        } else {
            setUsuarios([]);
            setShowSuggestions(false);
        }
    }, [nombreUsuario]);

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
        </div>
    );
}

export default Buscador;