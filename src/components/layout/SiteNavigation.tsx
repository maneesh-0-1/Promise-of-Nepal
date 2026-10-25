import React from 'react';

interface SiteNavigationProps {
  onOpenModal?: () => void;
}

export const SiteNavigation: React.FC<SiteNavigationProps> = () => {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '28px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        pointerEvents: 'none',
      }}
    >
      {/* Official AIESEC Blue Logo */}
      <a
        href="#hero"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          pointerEvents: 'auto',
          textDecoration: 'none',
        }}
      >
        <img
          src="/assets/Blue-Logo.png"
          alt="AIESEC"
          style={{
            height: '40px',
            width: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 2px rgba(3, 126, 243, 0.4))',
          }}
        />
      </a>
    </header>
  );
};
