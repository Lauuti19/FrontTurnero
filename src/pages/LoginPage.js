import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Swal from "sweetalert2"; // ✅ Importar SweetAlert
import '../styles/Login.css';
import loginImage from "../assets/login-image.jpg";
import registerImage from "../assets/register-image.jpg";
import transition from '../transition';
import { useAuth as useAuthHook, useUsers } from "../hooks"; 

const LoginPage = () => {
  const { login: authLogin } = useAuth();
  const { login: loginUser, registerUser, loading: authLoading, error: authError } = useAuthHook();
  const { getFullUserData, loading: usersLoading } = useUsers();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStage, setAnimationStage] = useState('idle');
  const [animationDirection, setAnimationDirection] = useState('');
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    dni: "",
    celular: "",
    password: ""
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ Función para mostrar SweetAlert de éxito
  const showSuccessAlert = (title, message) => {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#28a745',
      background: '#ffffff',
      iconColor: '#28a745',
      timer: 4000,
      timerProgressBar: true,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });
  };

  // ✅ Función para manejar errores de autenticación
  const handleAuthError = useCallback((errorMessage) => {
    if (errorMessage.includes('Email o contraseña incorrectos') || 
        errorMessage.includes('email o contraseña incorrectos') ||
        errorMessage.includes('contraseña incorrecta') ||
        errorMessage.includes('Credenciales inválidas') ||
        errorMessage.includes('Invalid credentials')) {
      return "Email o contraseña incorrectos. Por favor, intentá de nuevo.";
    }
    return errorMessage;
  }, []);

  // Efecto para manejar las etapas de la animación
  useEffect(() => {
    if (animationStage === 'collapsing') {
      const timer = setTimeout(() => {
        // Saltamos directamente de collapsing a expanding
        setIsRegistering(!isRegistering);
        setAnimationStage('expanding');
      }, 400); // Tiempo que tarda en desaparecer
      return () => clearTimeout(timer);
    } else if (animationStage === 'expanding') {
      const timer = setTimeout(() => {
        setAnimationStage('idle');
        setIsAnimating(false);
        setAnimationDirection('');
      }, 400); // Tiempo que tarda en aparecer
      return () => clearTimeout(timer);
    }
  }, [animationStage, isRegistering]);

  // ✅ Efecto para manejar errores del hook con el nuevo manejador
  useEffect(() => {
    if (authError) {
      const formattedError = handleAuthError(authError);
      setError(formattedError);
    }
  }, [authError, handleAuthError]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  }, [error]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  const validateForm = useCallback(() => {
    if (!formData.email || !formData.password) {
      setError("Por favor, completa todos los campos obligatorios");
      return false;
    }

    if (isRegistering) {
      if (!formData.nombre || !formData.dni || !formData.celular) {
        setError("Por favor, completa todos los campos");
        return false;
      }
      
      if (formData.dni.length < 7) {
        setError("El DNI debe tener al menos 7 dígitos");
        return false;
      }
      
      if (formData.celular.length < 10) {
        setError("El celular debe tener al menos 10 dígitos");
        return false;
      }
      
      if (formData.password.length <7) {
        setError("La contraseña debe tener al menos 7 caracteres");
        return false;
      }
    }

    return true;
  }, [formData, isRegistering]);

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const userData = {
        nombre: formData.nombre,
        email: formData.email,
        dni: formData.dni,
        celular: formData.celular,
        password: formData.password,
        id_rol: 2, // cliente
        id_estado: 2 // pendiente
      };

      // 🚀 Usamos el hook registerUser (sin token porque es registro público)
      await registerUser(null, userData);

      setError("");
      
      // ✅ Mostrar SweetAlert de éxito en lugar de alert nativo
      showSuccessAlert(
        "¡Registro Exitoso!",
        "Tu cuenta ha sido creada correctamente. Ahora podés iniciar sesión."
      );

      // Cambiar automáticamente a modo login
      startAnimation();

    } catch (error) {
      console.error("Error en registro:", error);
      const formattedError = handleAuthError(error.message);
      setError(formattedError);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ LOGIN CON HOOK (actualizado con el nuevo manejador de errores)
  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // 1. Login con el hook
      const loginData = await loginUser({
        email: formData.email,
        password: formData.password
      });

      // 2. Obtener datos completos del usuario
      const usuarioCompleto = await getCompleteUserAfterLogin(loginData.token, loginData.usuario);
      
      // 3. Actualizar contexto de autenticación
      authLogin(usuarioCompleto, loginData.token);

      // 4. Navegar según el estado
      navigateByUserStatus(usuarioCompleto.id_estado);

    } catch (error) {
      console.error("Error en login:", error);
      // El error ya está manejado por el hook y el useEffect
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ FUNCIÓN AUXILIAR: Obtener datos completos del usuario después del login
  const getCompleteUserAfterLogin = async (token, usuarioBasico) => {
    try {
      // Usar el hook para obtener datos completos
      const usuarioCompleto = await getFullUserData(token, usuarioBasico.id_usuario || usuarioBasico.id);
      
      // Combinar datos básicos del login con datos completos
      return {
        ...usuarioBasico,
        ...usuarioCompleto,
        // Asegurar que tenemos los campos necesarios
        id_usuario: usuarioBasico.id_usuario || usuarioBasico.id,
        nombre: usuarioCompleto.nombre || usuarioBasico.nombre,
        email: usuarioCompleto.email || usuarioBasico.email,
        id_rol: usuarioCompleto.id_rol || usuarioBasico.id_rol,
        id_estado: usuarioCompleto.id_estado || usuarioBasico.id_estado
      };
    } catch (error) {
      console.warn("No se pudieron obtener datos completos, usando datos básicos:", error);
      // Si falla, devolver los datos básicos del login
      return usuarioBasico;
    }
  };

  // ✅ FUNCIÓN AUXILIAR: Navegar según estado del usuario
  const navigateByUserStatus = (id_estado) => {
    switch (id_estado) {
      case 1: // Activo
        navigate("/perfil");
        break;
      case 2: // Pendiente
      case 3: // Suspendido
        navigate("/estado");
        break;
      default:
        navigate("/");
        break;
    }
  };

  const handleSubmit = async () => {
    if (isRegistering) {
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

  const startAnimation = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setAnimationStage('collapsing');
    setAnimationDirection(isRegistering ? 'to-login' : 'to-register');
    setError("");
    setFormData({
      nombre: "",
      email: "",
      dni: "",
      celular: "",
      password: ""
    });
  }, [isAnimating, isRegistering]);

  const getFormContainerClass = () => {
    if (animationStage !== 'idle') {
      return `${animationStage} ${animationDirection}`;
    }
    return isRegistering ? 'register-form' : 'login-form';
  };

  // ✅ Combinar loading states
  const combinedLoading = isLoading || authLoading || usersLoading;

  return (
    <div className={`auth-container ${isRegistering ? "register-mode" : "login-mode"}`}>
      {/* Fondo de imagen completa */}
      <div className="fullscreen-background">
        <img
          src={isRegistering ? registerImage : loginImage}
          alt="Fondo"
          className="background-image"
        />
        <div className="background-overlay"></div>
      </div>

      {/* Contenedor del formulario con transformación */}
      <div className={`form-transform-container ${getFormContainerClass()}`}>
        <div className="form-content">
          {/* Título */}
          <h2 className="form-title">
            {isRegistering ? "Crear Cuenta" : "Iniciar Sesión"}
          </h2>
          
          {/* Mensaje de error */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Campos del formulario */}
          <div className="form-fields">
            {isRegistering && (
              <FormField
                type="text"
                name="nombre"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                disabled={combinedLoading || isAnimating}
                required
              />
            )}

            <FormField
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              disabled={combinedLoading || isAnimating}
              required
              className="login-email-input"
            />
            
            {isRegistering && (
              <>
                <FormField
                  type="number"
                  name="dni"
                  placeholder="DNI"
                  value={formData.dni}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  disabled={combinedLoading || isAnimating}
                  required
                />
                <FormField
                  type="number"
                  name="celular"
                  placeholder="Número de celular"
                  value={formData.celular}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  disabled={combinedLoading || isAnimating}
                  required
                />
              </>
            )}

            <PasswordField
              showPassword={showPassword}
              value={formData.password}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              onToggle={togglePasswordVisibility}
              disabled={combinedLoading || isAnimating}
              placeholder="Contraseña"
              required
              className="login-password-input"
            />
          </div>
          {!isRegistering && (
            <div className="forgot-password-container">
              <button
                className="forgot-password-button"
                onClick={() => navigate('/forgot-password')}
                disabled={combinedLoading || isAnimating}
                type="button"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}
          
          {/* Botones de acción */}
          <ActionButtons
            isRegistering={isRegistering}
            isLoading={combinedLoading}
            isAnimating={isAnimating}
            onSubmit={handleSubmit}
            onSwitchMode={startAnimation}
          />
        </div>
      </div>
    </div>
  );
};

// Componentes auxiliares (se mantienen igual)
const FormField = ({ type, name, placeholder, value, onChange, onKeyPress, disabled, required }) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onKeyPress={onKeyPress}
    disabled={disabled}
    required={required}
    className="form-input"
  />
);

const PasswordField = ({ showPassword, value, onChange, onKeyPress, onToggle, disabled, placeholder, required }) => (
  <div className="password-container">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      disabled={disabled}
      required={required}
      className="form-input"
    />
    <button
      type="button"
      className="password-toggle"
      onClick={onToggle}
      disabled={disabled}
    >
      {showPassword ? <FiEyeOff /> : <FiEye />}
    </button>
  </div>
);

const ActionButtons = ({ isRegistering, isLoading, isAnimating, onSubmit, onSwitchMode }) => (
  <div className="login-action-buttons">
    <button 
      className={`submit-login-button ${isLoading ? 'loading' : ''}`}
      onClick={onSubmit}
      disabled={isLoading || isAnimating}
    >
      {isLoading ? (
        <span className="loading-text">Cargando...</span>
      ) : (
        isRegistering ? "Crear Cuenta" : "Ingresar"
      )}
    </button>

    <button
      className="switch-mode-button"
      onClick={onSwitchMode}
      disabled={isLoading || isAnimating}
      type="button"
    >
      {isRegistering
        ? "¿Ya tenés cuenta? Iniciar sesión"
        : "¿No tenés cuenta? Registrarse"}
    </button>
  </div>
);

export default transition(LoginPage);