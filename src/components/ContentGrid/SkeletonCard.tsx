import React from 'react';
import './SkeletonCard.scss';

const SkeletonCard: React.FC = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image shimmer" />
      <div className="skeleton-text shimmer" />
      <div className="skeleton-subtext shimmer" />
      <div className="skeleton-price shimmer" />
    </div>
  );
};

export default SkeletonCard;
