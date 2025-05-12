import MujerMain from '../assets/MujerMain.png'
import LogoNuevo from '../assets/DrakkarMejor.png';
import HomeSection2 from '../components/HomeSection2';
import '../styles/HomeHero.css';

const HomePage = () => {
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
              <img
                src={MujerMain}
                className="hero-image"
                alt="Fitness Model"
              />
            </div>
          </section>
            <HomeSection2></HomeSection2>
        </div>
)
}

export default HomePage;