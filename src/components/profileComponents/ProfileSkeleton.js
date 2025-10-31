// components/ProfileSkeleton.jsx
import React from "react";
import "../styles/Skeleton.css"; // reutiliza los estilos existentes

const ProfileSkeleton = () => {
  const renderSkeletonLine = (width = "100%", height = "12px") => (
    <div
      className="skeleton-line"
      style={{ width, height, borderRadius: "4px", margin: "6px 0" }}
    ></div>
  );

  return (
    <div className="user-profile-container">
      <div className="user-profile-box skeleton-box">
        {/* Header */}
        <header className="profile-header skeleton-header">
          <div className="skeleton-user-info">
            {renderSkeletonLine("120px", "18px")}
            {renderSkeletonLine("160px")}
            {renderSkeletonLine("80px")}
          </div>
          <div className="skeleton-icon skeleton-settings"></div>
        </header>

        {/* Rol */}
        <div className="skeleton-role">{renderSkeletonLine("80px")}</div>

        {/* Cards container */}
        <div className="profile-content">
          {/* Datos personales */}
          <div className="skeleton-card">
            {renderSkeletonLine("140px")}
            {renderSkeletonLine("60%")}
            {renderSkeletonLine("50%")}
          </div>

          {/* Cuota */}
          <div className="skeleton-card">
            {renderSkeletonLine("140px")}
            {renderSkeletonLine("70%")}
          </div>

          {/* Records */}
          <div className="skeleton-card">
            {renderSkeletonLine("140px")}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton-record-item">
                {renderSkeletonLine("90%")}
              </div>
            ))}
          </div>

          {/* CheckInOut */}
          <div className="skeleton-card skeleton-checkin">
            {renderSkeletonLine("140px")}
            <div className="skeleton-buttons">
              <div className="skeleton-btn"></div>
              <div className="skeleton-btn"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
