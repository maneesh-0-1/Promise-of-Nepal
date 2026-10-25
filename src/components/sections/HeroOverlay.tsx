import React, { useState, useEffect } from 'react';
import { ArrowRight, Mountain, Wind, Sparkles, Globe2, Leaf, Zap, Clock } from 'lucide-react';

interface HeroOverlayProps {
  onOpenModal: () => void;
}

export const HeroOverlay: React.FC<HeroOverlayProps> = ({ onOpenModal }) => {
  // 1. Antigravity Spatial 3D Perspective Tilt State
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized offset from center (-1 to +1)
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      // Subtle tilt: max 4.5 degrees for smooth weightless floating
      setTilt({ x: nx * 4.5, y: -ny * 4.5 });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 2. Live Chapter Launch Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ days: 42, hours: 18, minutes: 34, seconds: 50 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: 23, minutes: 59, seconds: 59 };
        return { ...prev, days: Math.max(0, prev.days - 1), hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="antigravity-perspective"
      style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '80px 48px 20px 48px',
        pointerEvents: 'none',
        zIndex: 10,
        boxSizing: 'border-box',
      }}
    >
      {/* Main Hero Content with Antigravity 3D Floating Perspective */}
      <div
        className="antigravity-card"
        style={{
          maxWidth: '520px',
          marginTop: 'auto',
          marginBottom: 'auto',
          pointerEvents: 'auto',
          transform: `perspective(1200px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateZ(8px)`,
          transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Eyebrow Badges */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '9999px',
              background: 'rgba(3, 126, 243, 0.16)',
              border: '1px solid rgba(3, 126, 243, 0.45)',
              fontSize: '0.66rem',
              fontWeight: 700,
              letterSpacing: '0.10em',
              color: '#4DA4FF',
              textTransform: 'uppercase',
              boxShadow: '0 2px 10px rgba(3, 126, 243, 0.2)',
            }}
          >
            <span>ROOTED IN NEPAL. CONNECTED TO THE WORLD.</span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              fontSize: '0.66rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: 'var(--snow-light)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Sparkles size={11} style={{ color: 'var(--himalaya-gold)' }} />
            <span>GLOBAL YOUTH MOVEMENT</span>
          </div>
        </div>

        {/* Hero Headline: THE PROMISE OF NEPAL */}
        <h1
          className="hero-headline font-heading"
          style={{
            fontSize: 'clamp(2.1rem, 3.8vw, 3.4rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            color: '#FFFFFF',
            textShadow: '0 4px 30px rgba(0, 0, 0, 0.95), 0 0 40px rgba(3, 126, 243, 0.15)',
            marginBottom: '6px',
            textTransform: 'uppercase',
          }}
        >
          THE PROMISE<br />OF NEPAL
        </h1>

        {/* Next Line: COMING SOON */}
        <div
          style={{
            fontSize: 'clamp(1.15rem, 1.9vw, 1.6rem)',
            fontWeight: 800,
            letterSpacing: '0.22em',
            color: 'var(--himalaya-gold)',
            textTransform: 'uppercase',
            textShadow: '0 0 24px rgba(245, 166, 35, 0.65)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
          }}
        >
          <span
            className="pulse-dot"
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--himalaya-gold)',
              display: 'inline-block',
              boxShadow: '0 0 14px var(--himalaya-gold)',
            }}
          />
          <span>COMING SOON</span>
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'clamp(0.85rem, 1.15vw, 0.96rem)',
            lineHeight: 1.5,
            color: 'rgba(241, 245, 249, 0.88)',
            fontWeight: 400,
            maxWidth: '440px',
            textShadow: '0 2px 14px rgba(0, 0, 0, 0.95)',
            marginBottom: '14px',
          }}
        >
          A new chapter of youth leadership in Nepal is taking shape. Join the movement that activates young leaders to shape the future.
        </p>

        {/* Live Chapter Launch Countdown Glass Capsule */}
        <div
          className="glass-card"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 16px',
            borderRadius: '14px',
            background: 'rgba(8, 16, 32, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.45)',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--himalaya-gold)' }}>
            <Clock size={13} className="pulse-dot" />
            <span style={{ fontSize: '0.64rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Launch In:
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>{timeLeft.days}</div>
              <div style={{ fontSize: '0.56rem', fontWeight: 600, color: 'var(--snow-dim)', letterSpacing: '0.08em' }}>DAYS</div>
            </div>
            <span style={{ color: 'rgba(255, 255, 255, 0.25)', fontWeight: 700 }}>:</span>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>{String(timeLeft.hours).padStart(2, '0')}</div>
              <div style={{ fontSize: '0.56rem', fontWeight: 600, color: 'var(--snow-dim)', letterSpacing: '0.08em' }}>HRS</div>
            </div>
            <span style={{ color: 'rgba(255, 255, 255, 0.25)', fontWeight: 700 }}>:</span>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div style={{ fontSize: '0.56rem', fontWeight: 600, color: 'var(--snow-dim)', letterSpacing: '0.08em' }}>MIN</div>
            </div>
            <span style={{ color: 'rgba(255, 255, 255, 0.25)', fontWeight: 700 }}>:</span>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#FFD166', lineHeight: 1 }}>{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div style={{ fontSize: '0.56rem', fontWeight: 600, color: 'var(--snow-dim)', letterSpacing: '0.08em' }}>SEC</div>
            </div>
          </div>
        </div>

        {/* Action Button & Community Social Proof */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '22px',
          }}
        >
          <button
            onClick={onOpenModal}
            className="btn-primary shimmer-hover"
            style={{
              fontSize: '0.94rem',
              padding: '13px 26px',
              boxShadow: '0 8px 30px rgba(3, 126, 243, 0.45)',
            }}
          >
            <span>Be Part of the Journey</span>
            <ArrowRight size={17} />
          </button>

          {/* Social Proof Pioneer Avatar Stack */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #037EF3, #00C6FF)',
                  border: '2px solid #040810',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                }}
              >
                K
              </div>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F5A623, #FFD166)',
                  border: '2px solid #040810',
                  marginLeft: '-8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  color: '#040810',
                }}
              >
                P
              </div>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #E63946, #FF8A8A)',
                  border: '2px solid #040810',
                  marginLeft: '-8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                }}
              >
                A
              </div>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--snow-muted)', fontWeight: 500 }}>
              <strong style={{ color: '#FFFFFF', fontWeight: 700 }}>480+</strong> young leaders registered
            </div>
          </div>
        </div>

        {/* Pillars of Impact: 3 Floating Antigravity Micro-Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            maxWidth: '470px',
          }}
        >
          {/* Pillar 1 */}
          <div
            className="glass-card"
            style={{
              padding: '10px 12px',
              borderRadius: '12px',
              background: 'rgba(8, 16, 32, 0.50)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              cursor: 'default',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4DA4FF' }}>
              <Globe2 size={13} />
              <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>Global Reach</span>
            </div>
            <div style={{ fontSize: '0.64rem', color: 'var(--snow-dim)', lineHeight: 1.3 }}>
              120+ entities empowering youth
            </div>
          </div>

          {/* Pillar 2 */}
          <div
            className="glass-card"
            style={{
              padding: '10px 12px',
              borderRadius: '12px',
              background: 'rgba(8, 16, 32, 0.50)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              cursor: 'default',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--himalaya-gold)' }}>
              <Leaf size={13} />
              <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>Himalayan Impact</span>
            </div>
            <div style={{ fontSize: '0.64rem', color: 'var(--snow-dim)', lineHeight: 1.3 }}>
              SDG & climate action projects
            </div>
          </div>

          {/* Pillar 3 */}
          <div
            className="glass-card"
            style={{
              padding: '10px 12px',
              borderRadius: '12px',
              background: 'rgba(8, 16, 32, 0.50)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              cursor: 'default',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FF6B6B' }}>
              <Zap size={13} />
              <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>Leadership Labs</span>
            </div>
            <div style={{ fontSize: '0.64rem', color: 'var(--snow-dim)', lineHeight: 1.3 }}>
              Real-world leadership training
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar: Mountain Coordinates & Breeze Telemetry */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          pointerEvents: 'auto',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Real-time Mountain Elevation & Coordinates Telemetry */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.74rem',
            color: 'var(--snow-dim)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Mountain size={13} style={{ color: 'var(--himalaya-gold)' }} />
            <span>Himalayan Massif</span>
          </span>
          <span>•</span>
          <span>Ama Dablam Summit: 6,812m</span>
          <span>•</span>
          <span>27°51′N 86°51′E</span>
        </div>

        {/* Alpine Breeze Telemetry */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.74rem',
            color: 'var(--aiesec-blue-light)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          <Wind size={13} />
          <span>Himalayan Breeze: Active</span>
          <span>•</span>
          <span style={{ color: 'var(--snow-dim)' }}>Summit Winds: 28 km/h WNW</span>
        </div>
      </div>
    </section>
  );
};
