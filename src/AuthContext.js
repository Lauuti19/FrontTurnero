import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [creditos, setCreditos] = useState(null);

  // Función para obtener el token (definida primero)
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Función para obtener créditos
  const fetchCreditos = async (id_usuario) => {
    if (!id_usuario) return;
    
    try {
      const token = getToken(); // Ahora getToken está definida
      if (!token) {
        console.error("No hay token disponible");
        return;
      }

      // Intenta con el endpoint de payments
      const res = await fetch(`https://backturnero.onrender.com/api/payments/active-fees`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
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
      } else {
        console.warn("No se pudieron obtener créditos, usando valor por defecto");
        setCreditos(0);
        return 0;
      }
    } catch (error) {
      console.error('Error fetching créditos:', error);
      setCreditos(0);
      return 0;
    }
  };

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    const tokenGuardado = localStorage.getItem("token");
    
    if (usuarioGuardado) {
      const usuarioData = JSON.parse(usuarioGuardado);
      setUsuario(usuarioData);
      // Cargar créditos al iniciar si hay usuario
      if (usuarioData) {
        fetchCreditos(usuarioData.id_usuario || usuarioData.id);
      }
    }
  }, []);

  // Función para actualizar créditos manualmente
  const actualizarCreditos = async () => {
    if (usuario?.id_usuario || usuario?.id) {
      const id_usuario = usuario.id_usuario || usuario.id;
      await fetchCreditos(id_usuario);
    }
  };

  const login = (usuarioData, token) => {
    localStorage.setItem("usuario", JSON.stringify(usuarioData));
    localStorage.setItem("token", token);
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

  // Función para verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return !!getToken();
  };

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      login, 
      logout, 
      getUserId, 
      getToken, // Añade esta función
      isAuthenticated, // Opcional: útil para verificar autenticación
      creditos, 
      actualizarCreditos 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);