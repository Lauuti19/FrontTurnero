import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import '../styles/Login.css';
import loginImage from "../assets/login-image.jpg";
import registerImage from "../assets/register-image.jpg";

const LoginPage = () => {
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
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

  const handleSubmit = async () => {
    if (isRegistering) {
      try {
        const response = await fetch("http://localhost:3001/api/auth/register", {
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
        const response = await fetch("http://localhost:3001/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.token);

          const perfilRes = await fetch("http://localhost:3001/api/auth/perfil", {
            headers: {
              Authorization: `Bearer ${data.token}`
            }
          });

          const perfilData = await perfilRes.json();

          login(perfilData.usuario);


          const id_rol = perfilData.usuario.id_rol;
          const id_estado = perfilData.usuario.id_estado;

          if (id_estado === 1 && id_rol === 1) {
            navigate("/admin");
          } else if (id_estado === 1 && id_rol === 2) {
            navigate("/profesor");
          } else if (id_estado === 1 && id_rol === 3) {
            navigate("/alumno");
          } else if (id_estado === 2 || id_estado === 3) {
            navigate("/estado");
          } else {
            alert("Rol desconocido");
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

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
          />
          
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

export default LoginPage;
