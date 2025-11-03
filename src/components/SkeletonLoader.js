// components/SkeletonLoader.jsx
import React from 'react';
import '../styles/SkeletonLoader.css';

const SkeletonLoader = ({ 
  type = 'card', 
  count = 1, 
  height = 'auto',
  width = '100%',
  className = ''
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`skeleton-card ${className}`} style={{ height, width }}>
            <div className="skeleton-header">
              <div className="skeleton-avatar"></div>
              <div className="skeleton-text-container">
                <div className="skeleton-line skeleton-title"></div>
                <div className="skeleton-line skeleton-subtitle"></div>
              </div>
            </div>
            <div className="skeleton-content">
              <div className="skeleton-line"></div>
              <div className="skeleton-line skeleton-short"></div>
            </div>
            <div className="skeleton-footer">
              <div className="skeleton-button"></div>
              <div className="skeleton-button"></div>
            </div>
          </div>
        );

      case 'class-item':
        return (
          <div className={`skeleton-class-item ${className}`} style={{ height, width }}>
            <div className="skeleton-class-main">
              <div className="skeleton-class-icon"></div>
              <div className="skeleton-class-details">
                <div className="skeleton-line skeleton-class-title"></div>
                <div className="skeleton-class-meta">
                  <div className="skeleton-line skeleton-time"></div>
                  <div className="skeleton-line skeleton-trainer"></div>
                </div>
                <div className="skeleton-line skeleton-description"></div>
              </div>
              <div className="skeleton-class-capacity">
                <div className="skeleton-capacity-bar"></div>
                <div className="skeleton-line skeleton-capacity-text"></div>
              </div>
            </div>
            <div className="skeleton-class-actions">
              <div className="skeleton-class-features">
                <div className="skeleton-tag"></div>
                <div className="skeleton-tag"></div>
                <div className="skeleton-tag"></div>
              </div>
              <div className="skeleton-action-buttons">
                <div className="skeleton-button"></div>
                <div className="skeleton-button"></div>
              </div>
            </div>
          </div>
        );

      case 'table-row':
        return (
          <div className={`skeleton-table-row ${className}`} style={{ height, width }}>
            <div className="skeleton-table-cell">
              <div className="skeleton-line"></div>
            </div>
            <div className="skeleton-table-cell">
              <div className="skeleton-line"></div>
            </div>
            <div className="skeleton-table-cell">
              <div className="skeleton-line"></div>
            </div>
            <div className="skeleton-table-cell">
              <div className="skeleton-line"></div>
            </div>
            <div className="skeleton-table-cell">
              <div className="skeleton-action-buttons">
                <div className="skeleton-button small"></div>
                <div className="skeleton-button small"></div>
              </div>
            </div>
          </div>
        );

      case 'list-item':
        return (
          <div className={`skeleton-list-item ${className}`} style={{ height, width }}>
            <div className="skeleton-line"></div>
            <div className="skeleton-line skeleton-short"></div>
          </div>
        );

      case 'text':
        return (
          <div className={`skeleton-text ${className}`} style={{ height, width }}>
            <div className="skeleton-line"></div>
          </div>
        );

      default:
        return (
          <div className={`skeleton-default ${className}`} style={{ height, width }}>
            <div className="skeleton-line"></div>
          </div>
        );
    }
  };

  if (count > 1) {
    return (
      <div className="skeleton-container">
        {Array.from({ length: count }).map((_, index) => (
          <React.Fragment key={index}>
            {renderSkeleton()}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return renderSkeleton();
};

export default SkeletonLoader;