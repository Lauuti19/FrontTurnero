import React from 'react';
import { useAuth } from "../AuthContext";
import ClassSchedule from './ClassSchedule'; // Ajusta la ruta según tu estructura

const ClassesUserV2 = () => {
  const { getUserId } = useAuth();
  const userId = getUserId?.() || JSON.parse(localStorage.getItem('usuario'))?.id_usuario;

  return (
    <ClassSchedule
      userId={userId}
      isEmbedded={false}
      showHeader={true}
      adminMode={false}
      customTitle="Mis clases"
      customSubtitle="Lo que tenés para hoy"
    />
  );
};

export default ClassesUserV2;