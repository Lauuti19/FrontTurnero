import { useEffect } from 'react';
import MujerMain from '../assets/MujerMain.png'
import LogoNuevo from '../assets/DrakkarMejor.png';
import HomeSection2 from '../components/HomeSection2';
import '../styles/HomeHero.css';
import { fetchJson } from '../services/api';

const HomePage = () => {
  useEffect(() => {
    const wakeUpBackend = async () => {
      try {
        console.log('Iniciando llamada al backend para activarlo...');
        const response = await fetchJson('/health');
        console.log('Backend activado correctamente:', response);
      } catch (error) {
        console.warn('Error al activar el backend (puede ser normal en desarrollo):', error.message);
      }
    };

    wakeUpBackend();
  }, []);

  return (
    <div>
      <section className="drakkar-hero">
        <div className="hero-content">
          <h1 className="hero-title">Bienvenido a</h1>
          <img className="logo" src={LogoNuevo} alt=''></img>
          <h2 className="hero-subtitle">Descubre nuestras disciplinas</h2>
          <p className="hero-description">
            En Drakkar nos especializamos en ofrecer programas de entrenamiento en
            CrossFit, Funcional y Musculación para ayudarte a alcanzar tus metas
            físicas y mejorar tu salud y bienestar.
          </p>
        </div>
        <div className="hero-image-wrapper">
          <div className="hero-bg-anim" aria-hidden="true"></div>
          <img
            src={MujerMain}
            className="hero-image"
            alt="Fitness Model"
          />
        </div>
      </section>
      <HomeSection2></HomeSection2>
    </div>
  );
}

export default HomePage;