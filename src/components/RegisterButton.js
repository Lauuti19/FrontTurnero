// components/RegisterButton.jsx
import React from 'react';
import './RegisterButton.css';

const RegisterButton = ({
  type = 'register', // 'register' | 'unregister'
  title = "Anotarse",
  disabled = false,
  disabledReason = "",
  loading = false,
  onClick,
  loadingTitle = "Cargando..."
}) => {
  // Determinar las clases CSS según el estado
  const getButtonClasses = () => {
    const baseClasses = "register-button";
    
    if (loading) {
      return `${baseClasses} loading`;
    }
    
    if (disabled) {
      return `${baseClasses} disabled`;
    }
    
    return `${baseClasses} ${type}`;
  };

  const getButtonContent = () => {
    if (loading) {
      return (
        <>
          {loadingTitle}
        </>
      );
    }
    
    return title;
  };

  const getButtonTitle = () => {
    if (loading) return loadingTitle;
    if (disabled && disabledReason) return disabledReason;
    return title;
  };

  const handleClick = (e) => {
    e.stopPropagation(); // Prevenir que se propague al contenedor padre
    if (!loading && !disabled) {
      onClick();
    }
  };

  return (
    <div className="register-button-container">
      <button
        className={getButtonClasses()}
        onClick={handleClick}
        disabled={loading || disabled}
        title={getButtonTitle()}
      >
        {getButtonContent()}
      </button>
    </div>
  );
};

export default RegisterButton;