import React from 'react';
import { Mountain, Compass, Sparkles } from 'lucide-react';

export const IntroSection: React.FC = () => {
  return (
    <section
      id="rooted-in-nepal"
      style={{
        position: 'relative',
        zIndex: 20,
        padding: '120px 32px 100px 32px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* Decorative Subtle Dhaka accent line */}
      <div
        style={{
          width: '60px',
          height: '3px',
          background: 'linear-gradient(90deg, #E63946, #F5A623, #037EF3)',
          borderRadius: '2px',
          marginBottom: '28px',
        }}
      />

      {/* Eyebrow */}
      <div
        style={{
          display: 'inline-block',
          fontSize: '0.78rem',
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: 'var(--himalaya-gold)',
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}
      >
        SECTION 01 • ROOTED IN NEPAL
      </div>

      {/* Main Headline */}
      <h2
        className="font-heading"
        style={{
          fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
          fontWeight: 800,
          lineHeight: 1.12,
          letterSpacing: '-0.025em',
          color: '#FFFFFF',
          marginBottom: '24px',
          maxWidth: '820px',
        }}
      >
        Small country.<br />
        <span style={{ color: '#389BFF' }}>Boundless possibilities.</span>
      </h2>

      {/* Core Copy */}
      <p
        style={{
          fontSize: 'clamp(1.1rem, 1.8vw, 1.35rem)',
          lineHeight: 1.65,
          color: 'rgba(241, 245, 249, 0.85)',
          maxWidth: '780px',
          marginBottom: '54px',
        }}
      >
        From the heart of the Himalayas, a generation of young people is preparing to explore new perspectives, build leadership, and create meaningful change.
      </p>

      {/* 3 Pillars of Nepali Youth Leadership Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '64px',
        }}
      >
        {/* Card 1 */}
        <div className="glass-card" style={{ padding: '36px 30px', borderRadius: '18px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(230, 57, 70, 0.15)',
              border: '1px solid rgba(230, 57, 70, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FF6B6B',
              marginBottom: '20px',
            }}
          >
            <Mountain size={22} />
          </div>
          <h3
            className="font-heading"
            style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}
          >
            The Himalayan Spirit
          </h3>
          <p style={{ color: 'var(--snow-muted)', fontSize: '0.94rem', lineHeight: 1.6 }}>
            Like the ancient mountaineers navigating untamed ridges, Nepali youth possess an innate resilience, grit, and capacity to overcome formidable terrain.
          </p>
        </div>

        {/* Card 2 */}
        <div className="glass-card" style={{ padding: '36px 30px', borderRadius: '18px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(3, 126, 243, 0.15)',
              border: '1px solid rgba(3, 126, 243, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#389BFF',
              marginBottom: '20px',
            }}
          >
            <Compass size={22} />
          </div>
          <h3
            className="font-heading"
            style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}
          >
            Global Horizons
          </h3>
          <p style={{ color: 'var(--snow-muted)', fontSize: '0.94rem', lineHeight: 1.6 }}>
            Expanding beyond geographic borders through real cross-cultural environments that challenge preconceptions and build worldwide citizenship.
          </p>
        </div>

        {/* Card 3 */}
        <div className="glass-card" style={{ padding: '36px 30px', borderRadius: '18px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(245, 166, 35, 0.15)',
              border: '1px solid rgba(245, 166, 35, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--himalaya-gold)',
              marginBottom: '20px',
            }}
          >
            <Sparkles size={22} />
          </div>
          <h3
            className="font-heading"
            style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}
          >
            Youth-Driven Movement
          </h3>
          <p style={{ color: 'var(--snow-muted)', fontSize: '0.94rem', lineHeight: 1.6 }}>
            A pure youth-to-youth ecosystem where young people organize conferences, forge international partnerships, and cultivate practical impact.
          </p>
        </div>
      </div>

      {/* Himalayan Heritage & Stats Bar */}
      <div
        className="glass-panel"
        style={{
          borderRadius: '20px',
          padding: '36px 40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px',
          textAlign: 'center',
        }}
      >
        <div>
          <div
            className="font-heading gold-accent"
            style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '6px' }}
          >
            8 of 14
          </div>
          <div style={{ fontSize: '0.84rem', color: 'var(--snow-muted)', letterSpacing: '0.04em' }}>
            Highest Summits in Nepal
          </div>
        </div>

        <div>
          <div
            className="font-heading"
            style={{ fontSize: '2.5rem', fontWeight: 800, color: '#389BFF', marginBottom: '6px' }}
          >
            120+
          </div>
          <div style={{ fontSize: '0.84rem', color: 'var(--snow-muted)', letterSpacing: '0.04em' }}>
            Countries in Global Network
          </div>
        </div>

        <div>
          <div
            className="font-heading"
            style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}
          >
            75+
          </div>
          <div style={{ fontSize: '0.84rem', color: 'var(--snow-muted)', letterSpacing: '0.04em' }}>
            Years of Youth Leadership
          </div>
        </div>

        <div>
          <div
            className="font-heading"
            style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FF6B6B', marginBottom: '6px' }}
          >
            100%
          </div>
          <div style={{ fontSize: '0.84rem', color: 'var(--snow-muted)', letterSpacing: '0.04em' }}>
            Student & Youth Operated
          </div>
        </div>
      </div>
    </section>
  );
};
