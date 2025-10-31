// hooks/useUserProfile.js
import { useEffect, useState } from "react";
import { getFullUserData } from "../services/userService";
import { useAuth } from "../AuthContext";

export const useUserProfile = () => {
  const { getToken, getUserId, usuario: usuarioAuth } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [cuota, setCuota] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const userId = getUserId();

    if (!token || !userId) {
      setError("No hay sesión activa");
      setLoading(false);
      return;
    }

    getFullUserData(token, userId)
      .then((data) => {
        const roleMap = { 1: "Administrador", 2: "Profesor", 3: "Alumno" };

        const usuarioCompleto = {
          ...data,
          rol: roleMap[data.id_rol] || "Desconocido",
          dni: data.dni || "No disponible",
          celular: data.celular || "No disponible",
          records: data.records || [],
          cuota: data.cuota || null,
        };

        setUsuario(usuarioCompleto);
        setCuota(data.cuota || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener datos del usuario:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [getToken, getUserId]);

  // Fallback con datos del contexto si falla el fetch
  useEffect(() => {
    if (usuarioAuth && !usuario && !loading && error) {
      const roleMap = { 1: "Administrador", 2: "Profesor", 3: "Alumno" };

      const usuarioFallback = {
        id_usuario: usuarioAuth.id_usuario || usuarioAuth.id,
        email: usuarioAuth.email,
        nombre: usuarioAuth.nombre,
        id_rol: usuarioAuth.id_rol,
        rol: roleMap[usuarioAuth.id_rol] || "Desconocido",
        dni: usuarioAuth.dni || "No disponible",
        celular: usuarioAuth.celular || "No disponible",
        records: [],
        cuota: null,
      };
      setUsuario(usuarioFallback);
      setError(null);
    }
  }, [usuarioAuth, usuario, loading, error]);

  return { usuario, cuota, error, loading };
};
