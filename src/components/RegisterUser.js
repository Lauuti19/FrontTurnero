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

  const handleSubmit = async () => {
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
      <div className="register-user-box">
        <h2 className="register-user-title">Registrar nuevo usuario</h2>
        <form className="register-user-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <input
            name="nombre"
            placeholder="Nombre y apellido"
            value={formData.nombre}
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            name="dni"
            placeholder="DNI"
            value={formData.dni}
            onChange={handleChange}
          />
          <input
            name="celular"
            placeholder="Celular"
            value={formData.celular}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
          />
          <select name="id_rol" value={formData.id_rol} onChange={handleChange}>
            <option value="1">Administrador</option>
            <option value="2">Profesor</option>
            <option value="3">Alumno</option>
          </select>
          <button type="submit" className="register-user-btn">Registrar Usuario</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
