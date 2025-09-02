import { useState } from "react";
import "../styles/RegisterUser.css";

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombre: "",
    dni: "",
    celular: "",
    id_rol: "1", 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/auth/register-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        alert("Usuario registrado correctamente");
        setFormData({
          email: "",
          password: "",
          nombre: "",
          dni: "",
          celular: "",
          id_rol: "1"
        });
      } else {
        alert(data.message || "Error al registrar el usuario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="register-user-container">
      <h2 className="register-user-title">Crear Usuario</h2>
      <div className="register-user-box">
        
        <form className="register-user-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Nombre</label>
            <input
              name="nombre"
              placeholder="John Doe"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-field">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-field">
            <label>DNI</label>
            <input
              name="dni"
              placeholder="12345678"
              value={formData.dni}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-field">
            <label>Celular</label>
            <input
              name="celular"
              placeholder="1123456789"
              value={formData.celular}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-field">
            <label>Contraseña</label>
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-field">
            <label>Rol</label>
            <select name="id_rol" value={formData.id_rol} onChange={handleChange}>
              <option value="1">Administrador</option>
              <option value="2">Profesor</option>
              <option value="3">Alumno</option>
            </select>
          </div>
          
          <button type="submit" className="register-user-btn">Registrar Usuario</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;