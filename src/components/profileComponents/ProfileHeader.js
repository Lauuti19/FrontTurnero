import { BiCog } from "react-icons/bi";

export const ProfileHeader = ({ usuario }) => (
  <header className="profile-header">
    <div>
      <h2 className="user-profile-title">Mi Perfil</h2>
      <p className="user-mail">{usuario?.email}</p>
      <p className="user-name">{usuario?.nombre}</p>
    </div>
    <a href="/editar" className="settings-icon" title="Editar perfil">
      <BiCog />
    </a>
  </header>
);
