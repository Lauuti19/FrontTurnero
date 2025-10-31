import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi";
import '../styles/Login.css';
import loginImage from "../assets/login-image.jpg";
import registerImage from "../assets/register-image.jpg";
import transition from '../transition';
import { registerUser, loginUser, getCompleteUserAfterLogin } from "../services/auth";

const LoginPage = () => {
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    dni: "",
    celular: "",
    password: ""
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setError("");
    try {
      console.log("Datos de registro:", formData);
      await registerUser(formData);
      alert("Registrado correctamente");
      setIsRegistering(false);
      // Limpiar formulario después del registro exitoso
      setFormData({
        nombre: "",
        email: "",
        dni: "",
        celular: "",
        password: ""
      });
    } catch (error) {
      console.error("Error en registro:", error);
      setError(error.message || "Error al registrar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      console.log("Datos de login:", { email: formData.email, password: formData.password });
      const loginData = await loginUser({
        email: formData.email,
        password: formData.password
      });

      console.log("Respuesta del login:", loginData);

      // Guardar token
      localStorage.setItem("token", loginData.token);

      // Obtener usuario completo con todos los datos combinados
      const usuarioCompleto = await getCompleteUserAfterLogin(loginData.token, loginData);
      console.log("Usuario completo:", usuarioCompleto);
      
      // Hacer login con los datos completos del usuario
      login(usuarioCompleto, loginData.token);

      // Navegación basada en el estado del usuario
      const { id_estado } = usuarioCompleto;
      console.log("Navegando con usuario:", usuarioCompleto);

      if (id_estado === 1) {
        navigate("/perfil");
      } else if (id_estado === 2 || id_estado === 3) {
        navigate("/estado");
      } else {
        setError("Estado de usuario desconocido");
        navigate("/");
      }

    } catch (error) {
      console.error("Error en login:", error);
      setError(error.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validaciones básicas
    if (!formData.email || !formData.password) {
      setError("Por favor, completa todos los campos obligatorios");
      return;
    }

    if (isRegistering) {
      if (!formData.nombre || !formData.dni || !formData.celular) {
        setError("Por favor, completa todos los campos");
        return;
      }
      await handleRegister();
    } else {
      await handleLogin();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const switchMode = () => {
    setIsRegistering(!isRegistering);
    setError("");
    // Limpiar formulario al cambiar de modo
    setFormData({
      nombre: "",
      email: "",
      dni: "",
      celular: "",
      password: ""
    });
  };

  return (
    <div className={`auth-container ${isRegistering ? "registering" : ""}`}>
      <div className="image-background">
        <img
          src={isRegistering ? registerImage : loginImage}
          alt="Fondo"
          className="background-img"
        />
      </div>
      <div className="form-box">
        <div className="form-content">
          <h2 className="TituloLogin">{isRegistering ? "Registrarse" : "Iniciar Sesión"}</h2>
          
          {/* Mostrar mensaje de error */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {isRegistering && (
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          
          {isRegistering && (
            <>
              <input
                type="number"
                name="dni"
                placeholder="DNI"
                value={formData.dni}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <input
                type="number"
                name="celular"
                placeholder="Celular"
                value={formData.celular}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
            </>
          )}

          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <span className="password-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
          
          <button 
            className={`btn primary ${isLoading ? 'loading' : ''}`} 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : (isRegistering ? "Crear Cuenta" : "Ingresar")}
          </button>

          <button
            className="btn link"
            onClick={switchMode}
            disabled={isLoading}
          >
            {isRegistering
              ? "¿Ya tenés cuenta? Iniciar sesión"
              : "¿No tenés cuenta? Registrarse"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default transition(LoginPage);