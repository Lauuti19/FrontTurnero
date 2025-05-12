import React from "react";
import "../styles/HomeSection2.css";
import EntrenamientoVideo1 from '../assets/login.MOV';
import EntrenamientoVideo2 from '../assets/Ejemplo2.MOV';
//<p className="hero-description">
//Además de nuestras clases grupales, ofrecemos horarios flexibles con modalidad Open Box, donde podrás entrenar fuera de las clases y utilizar libremente los elementos del gimnasio para diseñar tu propia rutina. Mejora tu fuerza, resistencia y movilidad a tu ritmo y de una manera divertida y efectiva.
//</p>

import CTAButton from "./CTAButton";

const DiscoverServices = () => {
  return (
    <section className="discover-services">
      <article className="section-article" id="first-data">
        <h2 className="section-subtitle">Descubre Nuestros Servicios</h2>
        <h3 className="section-title">Conoce Nuestro Equipo</h3>
        <p className="section-text">
          En Drakkar, creemos que el entrenamiento físico es mucho más que
          simplemente levantar pesas o correr. Es una forma de vida que nos
          permite mejorar nuestra salud, fuerza y resistencia
        </p>
        <CTAButton text="Unete a Nosotros" />
      </article>
    </section>
  );
};

const TrainerShowcase = () => {
  return (
    <section className="trainer-showcase">
      <video
        className="trainer-video"
        src={EntrenamientoVideo1}
        autoPlay
        loop
        muted
        playsInline
      />
    </section>
  );
};


const GroupClassesSection = () => {
  return (
    <section className="group-classes-section">
      <article className="section-article" id="second-data">
      <h2 className="group-title">Crossfit <span id="Barra">-</span> Funcional</h2>
        <h3 className="group-subtitle">Clases Grupales</h3>
        <p className="section-text">
          En Drakkar, ofrecemos clases grupales de CrossFit y Funcional
          adaptadas a todos los niveles. Nuestros entrenadores te guiarán y
          motivarán en cada sesión, ayudándote a alcanzar tu máximo potencial.
        </p>
        <CTAButton text="Reserva tu Clase" />
      </article>
    </section>
  );
};

const ImageShow2 = () => {
  return (
    <section className="trainer-showcase">
      <video
        className="trainer-video"
        id="video2"
        src={EntrenamientoVideo2}
        autoPlay
        loop
        muted
        playsInline
      />
    </section>
  );
};
const OpenBoxSection = () => {
  return (
    <section className="openbox-section">
      <article className="open-article" id="third-data">
      <h2 className="open-title">Horarios flexibles</h2>
        <h3 className="open-subtitle">Open Box</h3>
        <p className="open-section-text">
        Además de nuestras clases grupales, ofrecemos horarios flexibles con modalidad 
        Open Box, donde podrás entrenar fuera de las clases y utilizar libremente los 
        elementos del gimnasio para diseñar tu propia rutina. Mejora tu fuerza, resistencia 
        y movilidad a tu ritmo y de una manera divertida y efectiva.
        </p>
        <CTAButton text="Reserva tu lugar" />
      </article>
    </section>
  );
};

const OpenBoxImg = () => {
  return (
    <section className="open-showcase">
      <video
        className="open-video"
        id="video3"
        src={EntrenamientoVideo2}
        autoPlay
        loop
        muted
        playsInline
      />
    </section>
  );
};


const HomeSection2 = () => {
  return (
    <main className="services-section">
      <div className="row">
        <DiscoverServices />
        <TrainerShowcase />
      </div>
      <div className="row">
        <ImageShow2 />
        <GroupClassesSection />
      </div>
      <div className="row">
        <OpenBoxSection />
        <OpenBoxImg />
      </div>
    </main>
  );
};


export default HomeSection2;
