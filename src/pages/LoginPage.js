import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi";
import '../styles/Login.css';
import loginImage from "../assets/login-image.jpg";
import registerImage from "../assets/register-image.jpg";
import transition from '../transition'

const LoginPage = () => {
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    dni: "",
    celular: "",
    password: ""
  });

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    console.log(formData.email, 'Email', formData.password, 'Password');  
    if (isRegistering) {
      try {
        const response = await fetch("https://backturnero-vvk6.onrender.com/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (response.ok) {
          alert("Registrado correctamente");
          setIsRegistering(false);
        } else {
          alert(data.message || "Error al registrar");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión con el servidor.");
      }
    } else {
      try {
        const response = await fetch("https://backturnero-vvk6.onrender.com/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();

        if (response.ok) {
            
          // Guarda el token
          localStorage.setItem("token", data.token);
          const tokenGuardado = localStorage.getItem("token");

          // VERIFICACIÓN DEL TOKEN - prueba el endpoint de perfil
          try {
            const perfilRes = await fetch(`https://backturnero-vvk6.onrender.com/api/auth/perfil`, {
              headers: {
                'Authorization': `Bearer ${data.token}`,
                'Content-Type': 'application/json'
              }
            });

            if (perfilRes.ok) {
              const perfilData = await perfilRes.json();
              console.log("Perfil obtenido correctamente:", perfilData);
              
              // Usa los datos del PERFIL que son más completos
              login(perfilData.usuario, data.token);
            } else {
              console.warn("No se pudo obtener el perfil, usando datos del login");
              // Si falla el perfil, usa los datos del login
              login(data.usuario, data.token);
            }
          } catch (perfilError) {
            console.error("Error obteniendo perfil:", perfilError);
            // Si hay error, usa los datos del login
            login(data.usuario, data.token);
          }

          // Navegación basada en los datos del usuario
          const usuarioFinal = data.usuario; // o perfilData.usuario si se obtuvo
          const id_rol = usuarioFinal.id_rol;
          const id_estado = usuarioFinal.id_estado;

          console.log("Navegando con:", { id_rol, id_estado });

          if (id_estado === 1) {
            // Usuario activo - va al perfil sin importar el rol
            navigate("/perfil");
          } else if (id_estado === 2 || id_estado === 3) {
            // Usuario inactivo o suspendido
            navigate("/estado");
          } else {
            alert("Estado de usuario desconocido");
            navigate("/");
          }

        } else {
          alert(data.message || "Error al iniciar sesión");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión con el servidor.");
      }
    }
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
          
          {isRegistering && (
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          
          {isRegistering && (
            <>
              <input
                type="number"
                name="dni"
                placeholder="DNI"
                value={formData.dni}
                onChange={handleChange}
              />
              <input
                type="number"
                name="celular"
                placeholder="Celular"
                value={formData.celular}
                onChange={handleChange}
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
            />
            <span className="password-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
          
          <button className="btn primary" onClick={handleSubmit}>
            {isRegistering ? "Crear Cuenta" : "Ingresar"}
          </button>

          <button
            className="btn link"
            onClick={() => setIsRegistering(!isRegistering)}
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