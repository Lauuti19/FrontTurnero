import { FaAddressCard, FaMobileAlt } from "react-icons/fa";

export const ProfileDatos = ({ usuario }) => (
  <section className="profile-card">
    <h3>Datos Personales</h3>
    <div className="Texto-Data">
      <FaAddressCard /> <strong>DNI:</strong>
      <p>{usuario?.dni}</p>
    </div>
    <div className="Texto-Data">
      <FaMobileAlt /> <strong>Celular:</strong>
      <p>{usuario?.celular}</p>
    </div>
  </section>
);
