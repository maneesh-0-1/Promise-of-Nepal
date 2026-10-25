import React from 'react';
import { Mountain } from 'lucide-react';

export const SiteFooter: React.FC = () => {
  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 20,
        backgroundColor: '#03060C',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Traditional Dhaka Textile Geometric Accent Stripe */}
      <div className="dhaka-border" />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '60px 32px 48px 32px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '30px',
            marginBottom: '40px',
          }}
        >
          {/* Brand & Mission Statement */}
          <div style={{ maxWidth: '440px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #037EF3 0%, #0056B3 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  color: '#FFFFFF',
                }}
              >
                A
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  letterSpacing: '0.08em',
                  color: '#FFFFFF',
                }}
              >
                AIESEC IN NEPAL
              </span>
            </div>
            <p style={{ color: 'var(--snow-dim)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              A global, non-governmental and not-for-profit youth-run organization activating the leadership potential of young people through cross-cultural exchanges and experiential learning.
            </p>
          </div>

          {/* Quick Pillars */}
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--snow-white)', letterSpacing: '0.08em', marginBottom: '14px', textTransform: 'uppercase' }}>
                EXPANSION
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: 'var(--snow-muted)' }}>
                <li>Kathmandu Chapter</li>
                <li>Pokhara Chapter</li>
                <li>Himalayan Youth Summit</li>
                <li>UN SDGs Nepal</li>
              </ul>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--snow-white)', letterSpacing: '0.08em', marginBottom: '14px', textTransform: 'uppercase' }}>
                GLOBAL MOVEMENT
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: 'var(--snow-muted)' }}>
                <li>Global Volunteer</li>
                <li>Global Talent</li>
                <li>Global Teacher</li>
                <li>Youth 4 Global Goals</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '28px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.78rem',
            color: 'var(--snow-dim)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>© {new Date().getFullYear()} AIESEC in Nepal. All rights reserved.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Inspired by the spirit of the Himalayas</span>
            <Mountain size={14} style={{ color: 'var(--himalaya-gold)' }} />
            <span>Kathmandu, Nepal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
