import { useState } from "react";
import '../styles/Login.css'
import loginImage from "../assets/login-image.jpg";
import registerImage from "../assets/register-image.jpeg";

const LoginPage = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
      nombre: "",
      email: "",
      dni: "",
      celular: "",
      password: ""
    });
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
            setIsRegistering(false); // volver a login
          } else {
            alert(data.message || "Error al registrar");
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Error de conexión con el servidor.");
        }
      } else {
        //Login
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
              <h2>{isRegistering ? "Registrarse" : "Iniciar Sesión"}</h2>
              <input type="text" name="nombre" placeholder="Usuario" value={formData.nombre} onChange={handleChange} />
              {isRegistering && (
                <>
                  <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                  <input type="number" name="dni" placeholder="DNI" maxLength="8" value={formData.dni} onChange={handleChange} />
                  <input type="number" name="celular" placeholder="Celular" value={formData.celular} onChange={handleChange} />
                </>
              )}
              <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} />
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