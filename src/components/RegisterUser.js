import { useState } from "react";
import Swal from "sweetalert2";
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
  const [loading, setLoading] = useState(false);

  // Función para mostrar alertas de éxito
  const showSuccessAlert = (title, message, userName = '') => {
    Swal.fire({
      title: title,
      html: userName 
        ? `${message}<br><strong>${userName}</strong>`
        : message,
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

  // Función para mostrar alertas de error
  const showErrorAlert = (title, errorMessage) => {
    Swal.fire({
      title: title,
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#dc3545',
      background: '#ffffff',
      showClass: {
        popup: 'animate__animated animate__headShake'
      }
    });
  };

  // Función para mostrar advertencias
  const showWarningAlert = (title, message) => {
    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#ffc107',
      background: '#ffffff',
      iconColor: '#ffc107'
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      showWarningAlert('Nombre requerido', 'Por favor ingresa el nombre del usuario.');
      return false;
    }

    if (!formData.email.trim()) {
      showWarningAlert('Email requerido', 'Por favor ingresa el email del usuario.');
      return false;
    }

    if (!formData.dni.trim()) {
      showWarningAlert('DNI requerido', 'Por favor ingresa el DNI del usuario.');
      return false;
    }

    if (!formData.celular.trim()) {
      showWarningAlert('Celular requerido', 'Por favor ingresa el número de celular.');
      return false;
    }

    if (!formData.password.trim()) {
      showWarningAlert('Contraseña requerida', 'Por favor ingresa una contraseña para el usuario.');
      return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showWarningAlert('Email inválido', 'Por favor ingresa un email válido.');
      return false;
    }

    // Validar DNI (solo números, 7-8 dígitos)
    const dniRegex = /^\d{7,8}$/;
    if (!dniRegex.test(formData.dni)) {
      showWarningAlert('DNI inválido', 'El DNI debe contener entre 7 y 8 dígitos numéricos.');
      return false;
    }

    // Validar celular (solo números, 10-15 dígitos)
    const celularRegex = /^\d{10,15}$/;
    if (!celularRegex.test(formData.celular)) {
      showWarningAlert('Celular inválido', 'El celular debe contener entre 10 y 15 dígitos numéricos.');
      return false;
    }

    // Validar contraseña (mínimo 7 caracteres)
    if (formData.password.length < 7) {
      showWarningAlert('Contraseña muy corta', 'La contraseña debe tener al menos 7 caracteres.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Mostrar alerta de carga
      Swal.fire({
        title: 'Registrando Usuario...',
        text: 'Por favor espera mientras creamos el usuario',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await fetch(
        "https://backturnero-vvk6.onrender.com/api/auth/register-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      
      // Cerrar alerta de carga
      Swal.close();

      if (response.ok) {
        showSuccessAlert(
          '¡Usuario Registrado!', 
          'El usuario ha sido creado exitosamente:',
          formData.nombre
        );
        
        // Resetear formulario
        setFormData({
          email: "",
          password: "",
          nombre: "",
          dni: "",
          celular: "",
          id_rol: "1",
        });
      } else {
        showErrorAlert('Error al registrar usuario', data.message || 'Error al registrar el usuario');
      }
    } catch (error) {
      // Cerrar alerta de carga si existe
      Swal.close();
      
      console.error("Error:", error);
      showErrorAlert('Error de conexión', 'Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleName = (roleId) => {
    const roles = {
      '1': 'Administrador',
      '2': 'Profesor', 
      '3': 'Alumno'
    };
    return roles[roleId] || 'Alumno';
  };

  return (
    <div className="CreateUserContainer">
      <h2 id="Title-Usuarios">Registrar Usuario</h2>

      <form className="form-group-class" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field">
            <label>Nombre Completo:</label>
            <input
              name="nombre"
              placeholder="Ej: Juan Pérez"
              value={formData.nombre}
              onChange={handleChange}
              required
              disabled={loading}
              maxLength={30}
            />
          </div>

          <div className="form-field">
            <label>Email:</label>
            <input
              name="email"
              type="email"
              placeholder="Ej: usuario@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              maxLength={100}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>DNI:</label>
            <input
              name="dni"
              placeholder="Ej: 12345678"
              value={formData.dni}
              onChange={handleChange}
              required
              disabled={loading}
              maxLength={8}
              minLength={8}
              pattern="[0-9]{7,8}"
              title="El DNI debe contener 7 u 8 dígitos numéricos"
            />
          </div>

          <div className="form-field">
            <label>Celular:</label>
            <input
              name="celular"
              placeholder="Ej: 1123456789"
              value={formData.celular}
              onChange={handleChange}
              required
              disabled={loading}
              maxLength={15}
              pattern="[0-9]{10,15}"
              title="El celular debe contener entre 10 y 15 dígitos"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Contraseña:</label>
            <input
              name="password"
              type="password"
              placeholder="Mínimo 7 caracteres"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              minLength={7}
            />
            <div className="helper-text">
              La contraseña debe tener al menos 7 caracteres
            </div>
          </div>

          <div className="form-field">
            <label>Rol:</label>
            <select 
              name="id_rol" 
              value={formData.id_rol} 
              onChange={handleChange}
              disabled={loading}
              className="role-select"
            >
              <option value="1">Administrador</option>
              <option value="2">Profesor</option>
              <option value="3">Alumno</option>
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          className={`btn-create-user ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="btn-spinner"></div>
              Registrando Usuario...
            </>
          ) : (
            'Registrar Usuario'
          )}
        </button>
      </form>

      <div className="user-tips">
        <div className="tips-header">
          <h4>Información importante</h4>
        </div>
        <div className="tips-content">
          <div className="tip-item">
            <span className="tip-icon">✓</span>
            <span>El email debe ser único para cada usuario</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">✓</span>
            <span>El DNI se utilizará para identificación</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">✓</span>
            <span>Los administradores tienen acceso completo al sistema</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">✓</span>
            <span>Los profesores pueden gestionar clases y alumnos, movimientos de caja y participar de clases sin creditos</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">✓</span>
            <span>Los alumnos pueden ver y anotarse a clases, ver sus rutinas, gestionar sus records y sus deudas.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;