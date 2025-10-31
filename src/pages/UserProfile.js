import React from "react";
import transition from "../transition";
import { useUserProfile } from "../hooks/useUserProfile";
import { useAuth } from "../AuthContext";
import { ProfileHeader } from "../components/profileComponents/ProfileHeader";
import { ProfileDatos } from "../components/profileComponents/ProfileDatos";
import { ProfileCuota } from "../components/profileComponents/ProfileCuotas";
import UserRecords from "../components/UserRecords";
import CheckInOut from "../components/CheckInOut";
import ProfileSkeleton from "../components/profileComponents/ProfileSkeleton";
import "../styles/UserProfile.css";

const UserProfile = () => {
  const { usuario, cuota, error, loading } = useUserProfile();
  const { getToken } = useAuth();

  if (loading) return <ProfileSkeleton />;
  if (error && !usuario)
    return (
      <div className="user-profile-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );

  const isAdmin = usuario?.id_rol === 1;
  const isProfesor = usuario?.id_rol === 2;
  const isAlumno = usuario?.id_rol === 3;

  return (
    <div className="user-profile-container">
      <div className="user-profile-box">
        <ProfileHeader usuario={usuario} />
        <p className="user-rol">{usuario?.rol}</p>

        {error && <p className="warning-message">⚠️ {error} (datos limitados)</p>}

        <div className="profile-content">
          <ProfileDatos usuario={usuario} />

          {(isProfesor || isAlumno) && (
            <div className="profile-card records-card">
              <UserRecords userId={usuario?.id_usuario} userData={usuario} token={getToken()} />
            </div>
          )}

          {isAlumno && <ProfileCuota cuota={cuota} />}

          {(isAdmin || isProfesor) && (
            <div className="profile-card">
              <CheckInOut userId={usuario?.id_usuario} token={getToken()} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default transition(UserProfile);
