// ============================================================
// PrintPadi – ContainerWithGradient Component
// Exact port of components/container.tsx
// Gray gradient background with faint logo watermarks
// ============================================================

import React from 'react';
import { IonIcon } from '@ionic/react';
import { arrowForwardCircleOutline } from 'ionicons/icons';

interface ContainerWithGradientProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onViewAll?: () => void;
}

export const ContainerWithGradient: React.FC<ContainerWithGradientProps> = ({
  title,
  description,
  children,
  onViewAll,
}) => {
  return (
    <div className="gradient-container">
      <div className="gradient-container__header">
        <div className="gradient-container__title-block">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <button 
          className="gradient-container__arrow" 
          onClick={onViewAll}
          aria-label="View all"
        >
          <IonIcon icon={arrowForwardCircleOutline} />
        </button>
      </div>

      {children}

      {/* Faint watermark logos */}
      <div 
        className="gradient-container__faint-logo gradient-container__faint-logo--tr" 
        aria-hidden="true"
      />
      <div 
        className="gradient-container__faint-logo gradient-container__faint-logo--bl" 
        aria-hidden="true"
      />
    </div>
  );
};

export default ContainerWithGradient;
