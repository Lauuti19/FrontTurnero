import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [creditos, setCreditos] = useState(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      const usuarioData = JSON.parse(usuarioGuardado);
      setUsuario(usuarioData);
      // Cargar créditos al iniciar si hay usuario
      if (usuarioData) {
        fetchCreditos(usuarioData.id_usuario || usuarioData.id);
      }
    }
  }, []);

  // Función para obtener créditos
  const fetchCreditos = async (id_usuario) => {
    if (!id_usuario) return;
    
    try {
      const res = await fetch(`http://localhost:3001/api/payments/active-fees/?id_usuario=${id_usuario}`);
      
      if (!res.ok) {
        throw new Error('Error al obtener créditos');
      }
      
      const data = await res.json();
      
      let creditosDisponibles = 0;
      
      if (data.cuotas && data.cuotas.length > 0) {
        creditosDisponibles = data.cuotas[0].creditos_disponibles || 0;
      } else if (data.creditos_disponibles) {
        creditosDisponibles = data.creditos_disponibles;
      } else if (data.cuota && data.cuota.creditos_disponibles) {
        creditosDisponibles = data.cuota.creditos_disponibles;
      }
      
      setCreditos(creditosDisponibles);
      return creditosDisponibles;
    } catch (error) {
      console.error('Error fetching créditos:', error);
      setCreditos(0);
      return 0;
    }
  };

  // Función para actualizar créditos manualmente
  const actualizarCreditos = async () => {
    if (usuario?.id_usuario || usuario?.id) {
      const id_usuario = usuario.id_usuario || usuario.id;
      await fetchCreditos(id_usuario);
    }
  };

  const login = (usuarioData) => {
    localStorage.setItem("usuario", JSON.stringify(usuarioData));
    setUsuario(usuarioData);
    // Cargar créditos al hacer login
    fetchCreditos(usuarioData.id_usuario || usuarioData.id);
  };

  const logout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setUsuario(null);
    setCreditos(null);
  };

  const getUserId = () => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      return usuario?.id_usuario || usuario?.id || null;
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      login, 
      logout, 
      getUserId, 
      creditos, 
      actualizarCreditos 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);