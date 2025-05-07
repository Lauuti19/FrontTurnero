import React from "react";
import Barquito from '../assets/barquito-drakkar.png';
import "../styles/Footer.css";

const Footer = () => {
  
  return (
    <footer className="footer">
      <div className="Contenedor-Footer" id="logo-cont">
          <img alt="" src={Barquito} className="Logo-img"></img>
          <h4 className="TextoLogo">@2024 Drakkar, Inc.</h4>
          <h4 className="TextoLogo">All rights reserved.</h4>
      </div>    
      <div className="Contenedor-Footer">
          <h3>Enlaces</h3>
          <a href="/">Inicio</a>
          <a href="/">Disciplinas</a>
          <a href="/">Sobre Nosotros</a>
          <a href="/">Contacto</a>
      </div> 
      <div className="Contenedor-Footer">
      <h3>Redes Sociales</h3>
          <a href="/">Facebook</a>
          <a href="/">Instagram</a>
          <h3>Trabaja con nosotros</h3>
          <a href="/">Enviar mi CV</a>
      </div> 
      <div className="Contenedor-Footer">
        <h3>Usuarios</h3>
        <a href="/">Iniciar Sesión</a>
        <a href="/">Registrarme</a>
        <a href="/">Olvidé mi contraseña</a>
      </div> 
    </footer>
  );
};

export default Footer;
