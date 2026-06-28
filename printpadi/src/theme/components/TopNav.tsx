// ============================================================
// PrintPadi – TopNav Component
// Exact port of components/top-navigation-bar.tsx
// Used on subpages (product detail, search, service pages)
// ============================================================

import React from 'react';
import { IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useAppBack } from '../lib/useAppBack';

interface TopNavProps {
  /** Show back button (enabled on subpages) */
  showBack?: boolean;
  /** Callback when back is clicked */
  onBack?: () => void;
  /** Optional search input */
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  /** Logo URL */
  logoSrc?: string;
  /** Flag image URL */
  flagSrc?: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  showBack = true,
  onBack,
  showSearch = true,
  onSearch,
  logoSrc = 'https://placehold.co/100x24/101010/9810FA?text=printpadi',
  flagSrc = 'https://placehold.co/25x25/008751/ffffff?text=NG',
}) => {
  const defaultBack = useAppBack({ restoreScroll: true });
  const handleBack = onBack || defaultBack;

  return (
    <div className="top-nav">
      {showBack && (
        <button className="top-nav__back" onClick={handleBack} aria-label="Go back">
          <IonIcon icon={arrowBack} />
        </button>
      )}

      <img className="top-nav__logo" src={logoSrc} alt="PrintPadi" />

      {showSearch && (
        <div className="top-nav__search">
          <input
            type="text"
            placeholder="Search"
            onChange={e => onSearch?.(e.target.value)}
            aria-label="Search products"
          />
          <button className="top-nav__search-btn" aria-label="Submit search">
            <IonIcon icon={require('ionicons/icons').search} style={{ fontSize: '12px', color: '#AAAAAA' }} />
          </button>
        </div>
      )}

      <img className="top-nav__flag" src={flagSrc} alt="Nigeria" />
    </div>
  );
};

export default TopNav;
