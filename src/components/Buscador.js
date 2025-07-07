import React,{useState, useEffect} from "react";

const Buscador = ({ onUsuarioSeleccionado }) => {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
    
      useEffect(() => {
      if (nombreUsuario.length >= 1) {
        fetch(`http://localhost:3001/api/usuarios/buscar?nombre=${nombreUsuario}`)
          .then(res => res.json())
          .then(data => {
            // Si data es un array, úsalo directamente
            setUsuarios(Array.isArray(data) ? data : data.usuarios || []);
          });
        setShowSuggestions(true);
      } else {
        setUsuarios([]);
        setShowSuggestions(false);
      }
    }, [nombreUsuario]);
    const handleUsuarioClick = (nombre) => {
        setUsuarioSeleccionado(nombre);
        setNombreUsuario(nombre);
        setShowSuggestions(false);
        const usuarioSeleccionado = usuarios.find(u => u.nombre === nombre);
        onUsuarioSeleccionado(usuarioSeleccionado); // Llama a la función con el usuario seleccionado
    };
    return (
        <div style={{ position: 'relative' }}>
            
            <input
              name="nombre_usuario"
              value={nombreUsuario}
              onChange={e => {
                setNombreUsuario(e.target.value);
                setUsuarioSeleccionado('');
              }}
              placeholder="Nombre de usuario"
              required
              autoComplete="off"
              className='input-buscar-user'
            />
            {console.log('showSuggestions:', showSuggestions, 'usuarios:', usuarios)}
            {showSuggestions && usuarios.length > 0 && (
              <ul className="suggestions-list">
                {usuarios.map(u => (
                  <li
                    key={u.id_usuario}
                    onClick={() => handleUsuarioClick(u.nombre)}
                  >
                    {u.nombre}
                  </li>
                ))}
              </ul>
            )}
          </div>
    );
}

export default Buscador;