import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [creditos, setCreditos] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga

  // Función para obtener el token
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Función para obtener créditos
  const fetchCreditos = async (id_usuario) => {
    if (!id_usuario) return;
    
    try {
      const token = getToken();
      if (!token) {
        console.error("No hay token disponible");
        return;
      }

      const res = await fetch(`https://backturnero-vvk6.onrender.com/api/payments/active-fees?id_usuario=${id_usuario}`, {
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
        console.warn(`No se pudieron obtener créditos. Status: ${res.status}`);
        setCreditos(0);
        return 0;
      }
    } catch (error) {
      console.error('Error fetching créditos:', error);
      setCreditos(0);
      return 0;
    }
  };

  // Cargar estado inicial desde localStorage
  useEffect(() => {
    const cargarEstadoInicial = async () => {
      try {
        const usuarioGuardado = localStorage.getItem("usuario");
        const tokenGuardado = localStorage.getItem("token");
        
        
        
        if (usuarioGuardado && tokenGuardado) {
          const usuarioData = JSON.parse(usuarioGuardado);
          
          
          setUsuario(usuarioData);
          
          // Cargar créditos si hay usuario
          if (usuarioData) {
            const id = usuarioData.id_usuario || usuarioData.id;
            await fetchCreditos(id);
          }
        } else {
          console.log("No hay sesión guardada");
        }
      } catch (error) {
        console.error("Error cargando estado inicial:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarEstadoInicial();
  }, []);

  
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
    const id = usuarioData.id_usuario || usuarioData.id;
    fetchCreditos(id);
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

  const isAuthenticated = () => {
    return !!getToken();
  };

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      login, 
      logout, 
      getUserId, 
      getToken,
      isAuthenticated,
      creditos, 
      actualizarCreditos,
      loading // Exportar estado de carga
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);