import GestionClases from '../../components/managerComponents/optionsData/gestionClases';
import AnotarUsuarioAClase from '../../components/AnotarUsuarioAClase';
import { useCallback } from 'react';

// Componentes placeholder - los reemplazarás con tus componentes reales

const GestionPlanes = ({ searchTerm }) => (
  <div className="section-content">
    <h2>Gestión de Planes</h2>
    <p>Búsqueda: {searchTerm}</p>
    <div>Contenido de gestión de planes aquí...</div>
  </div>
);

const GestionDisciplinas = ({ searchTerm }) => (
  <div className="section-content">
    <h2>Gestión de Disciplinas</h2>
    <p>Búsqueda: {searchTerm}</p>
    <div>Contenido de gestión de disciplinas aquí...</div>
  </div>
);

const GestionUsuarios = ({ searchTerm }) => (
  <div className="section-content">
    <h2>Gestión de Usuarios</h2>
    <p>Búsqueda: {searchTerm}</p>
    <div>Contenido de gestión de usuarios aquí...</div>
  </div>
);

const GestionRutinas = ({ searchTerm }) => (
  <div className="section-content">
    <h2>Gestión de Rutinas</h2>
    <p>Búsqueda: {searchTerm}</p>
    <div>Contenido de gestión de rutinas aquí...</div>
  </div>
);

const GestionCuotas = ({ searchTerm }) => (
  <div className="section-content">
    <h2>Gestión de Cuotas</h2>
    <p>Búsqueda: {searchTerm}</p>
    <div>Contenido de gestión de cuotas aquí...</div>
  </div>
);

const GestionEjercicios = ({ searchTerm }) => (
  <div className="section-content">
    <h2>Gestión de Ejercicios</h2>
    <p>Búsqueda: {searchTerm}</p>
    <div>Contenido de gestión de ejercicios aquí...</div>
  </div>
);


export const useGestionContent = () => {
  const renderContent = useCallback((section, subsection, searchTerm, currentDate) => {
    const sectionComponents = {
      clases: {
        todas: <GestionClases currentDate={currentDate} />,
        'anotar-usuario': <AnotarUsuarioAClase />
      },
      planes: {
        planes: <GestionPlanes searchTerm={searchTerm} />
      },
      disciplinas: {
        disciplinas: <GestionDisciplinas searchTerm={searchTerm} />
      },
      usuarios: {
        usuarios: <GestionUsuarios searchTerm={searchTerm} />
      },
      rutinas: {
        rutinas: <GestionRutinas searchTerm={searchTerm} />
      },
      cuotas: {
        cuotas: <GestionCuotas searchTerm={searchTerm} />
      },
      ejercicios: {
        ejercicios: <GestionEjercicios searchTerm={searchTerm} />
      }
    };

    // Obtener el componente correspondiente
    const sectionData = sectionComponents[section];
    if (!sectionData) {
      return <div className="section-placeholder">Sección no encontrada</div>;
    }

    const component = sectionData[subsection] || Object.values(sectionData)[0];
    if (!component) {
      return <div className="section-placeholder">Subsección no encontrada</div>;
    }

    return component;
  }, []);

  return {
    renderContent
  };
};