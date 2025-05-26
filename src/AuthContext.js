import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  const login = (usuarioData) => {
    localStorage.setItem("usuario", JSON.stringify(usuarioData));
    setUsuario(usuarioData);
  };

  const logout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setUsuario(null);
  };

  // NUEVO: función para obtener el id del usuario
  const getUserId = () => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      return usuario?.id_usuario || usuario?.id || null;
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, getUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
