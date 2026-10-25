import React, { useState } from 'react';
import { Globe } from 'lucide-react';

interface NetworkNode {
  id: string;
  city: string;
  country: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  type: 'hub' | 'connection';
  description: string;
}

const GLOBAL_NODES: NetworkNode[] = [
  { id: 'ktm', city: 'Kathmandu', country: 'Nepal (Himalayan Hub)', x: 70, y: 44, type: 'hub', description: 'The Origin: Himalayan youth leadership epicenter' },
  { id: 'gva', city: 'Geneva', country: 'Switzerland', x: 49, y: 32, type: 'connection', description: 'Global Headquarters & UN SDG Youth Dialogues' },
  { id: 'tyo', city: 'Tokyo', country: 'Japan', x: 86, y: 38, type: 'connection', description: 'Asia-Pacific Innovation & Global Talent Exchange' },
  { id: 'sao', city: 'São Paulo', country: 'Brazil', x: 32, y: 72, type: 'connection', description: 'Americas Youth Leadership & Social Entrepreneurship' },
  { id: 'nbo', city: 'Nairobi', country: 'Kenya', x: 57, y: 58, type: 'connection', description: 'African Continental Youth Congress & SDGs' },
  { id: 'kul', city: 'Kuala Lumpur', country: 'Malaysia', x: 74, y: 55, type: 'connection', description: 'ASEAN Cross-Cultural Volunteer Collaborations' },
  { id: 'ber', city: 'Berlin', country: 'Germany', x: 51, y: 27, type: 'connection', description: 'European Youth Assembly & Sustainability' },
];

export const GlobalImpactSection: React.FC = () => {
  const [activeNode, setActiveNode] = useState<NetworkNode>(GLOBAL_NODES[0]);

  const origin = GLOBAL_NODES[0]; // Kathmandu

  return (
    <section
      id="connected-to-the-world"
      style={{
        position: 'relative',
        zIndex: 20,
        padding: '120px 32px 100px 32px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* Eyebrow */}
      <div
        style={{
          display: 'inline-block',
          fontSize: '0.78rem',
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: 'var(--aiesec-blue-light)',
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}
      >
        SECTION 02 • CONNECTED TO THE WORLD
      </div>

      <h2
        className="font-heading"
        style={{
          fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
          fontWeight: 800,
          lineHeight: 1.12,
          letterSpacing: '-0.025em',
          color: '#FFFFFF',
          marginBottom: '20px',
        }}
      >
        Bridging the peaks with the planet.
      </h2>

      <p
        style={{
          fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
          lineHeight: 1.6,
          color: 'rgba(241, 245, 249, 0.85)',
          maxWidth: '720px',
          marginBottom: '54px',
        }}
      >
        From the valleys of Nepal to over 120 countries worldwide, AIESEC develops cross-cultural young leaders who turn vision into reality.
      </p>

      {/* The 3 Pillars Specified in Prompt */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '60px',
        }}
      >
        {/* Pillar 1: DISCOVER */}
        <div
          className="glass-card"
          style={{
            padding: '36px 30px',
            borderRadius: '18px',
            borderTop: '3px solid var(--aiesec-blue)',
          }}
        >
          <div
            style={{
              fontSize: '0.76rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: 'var(--aiesec-blue-light)',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            PILLAR I
          </div>
          <h3
            className="font-heading"
            style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}
          >
            DISCOVER
          </h3>
          <p
            style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'var(--himalaya-gold-light)',
              marginBottom: '14px',
            }}
          >
            “Step beyond what you know.”
          </p>
          <p style={{ color: 'var(--snow-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            Immerse yourself in unknown cultures, question routine comfort zones, and realize that your worldview is only one among millions.
          </p>
        </div>

        {/* Pillar 2: DEVELOP */}
        <div
          className="glass-card"
          style={{
            padding: '36px 30px',
            borderRadius: '18px',
            borderTop: '3px solid var(--himalaya-gold)',
          }}
        >
          <div
            style={{
              fontSize: '0.76rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: 'var(--himalaya-gold)',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            PILLAR II
          </div>
          <h3
            className="font-heading"
            style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}
          >
            DEVELOP
          </h3>
          <p
            style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#389BFF',
              marginBottom: '14px',
            }}
          >
            “Become the leader you want to be.”
          </p>
          <p style={{ color: 'var(--snow-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            Cultivate authentic self-awareness, empower teammates through empathy, and master solution-oriented leadership through practical responsibility.
          </p>
        </div>

        {/* Pillar 3: IMPACT */}
        <div
          className="glass-card"
          style={{
            padding: '36px 30px',
            borderRadius: '18px',
            borderTop: '3px solid var(--nepal-crimson)',
          }}
        >
          <div
            style={{
              fontSize: '0.76rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: '#FF6B6B',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            PILLAR III
          </div>
          <h3
            className="font-heading"
            style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}
          >
            IMPACT
          </h3>
          <p
            style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#FFFFFF',
              marginBottom: '14px',
            }}
          >
            “Turn ambition into action.”
          </p>
          <p style={{ color: 'var(--snow-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            Channel Nepali determination into local community sustainability and United Nations Sustainable Development Goals that produce measurable outcomes.
          </p>
        </div>
      </div>

      {/* Interactive Global Network Map Visualization */}
      <div
        className="glass-panel"
        style={{
          borderRadius: '24px',
          padding: '36px',
          position: 'relative',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(12, 26, 50, 0.7) 0%, rgba(4, 8, 16, 0.95) 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', fontWeight: 700, fontSize: '1.1rem' }}>
              <Globe size={18} style={{ color: 'var(--aiesec-blue)' }} />
              <span>Interactive Global Connection Matrix</span>
            </div>
            <p style={{ color: 'var(--snow-dim)', fontSize: '0.82rem', marginTop: '4px' }}>
              Select any global destination to preview cross-cultural exchange trajectories with Nepal
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {GLOBAL_NODES.map((node) => (
              <button
                key={node.id}
                onClick={() => setActiveNode(node)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: activeNode.id === node.id ? '1px solid var(--aiesec-blue)' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: activeNode.id === node.id ? 'rgba(3, 126, 243, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  color: activeNode.id === node.id ? '#FFFFFF' : 'var(--snow-muted)',
                  transition: 'all 0.2s',
                }}
              >
                {node.city}
              </button>
            ))}
          </div>
        </div>

        {/* Network Canvas SVG */}
        <div style={{ position: 'relative', width: '100%', height: '320px', background: 'rgba(0, 0, 0, 0.25)', borderRadius: '16px' }}>
          <svg style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id="nepalBeam" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#037EF3" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#F5A623" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#E63946" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Connecting lines from Kathmandu to each node */}
            {GLOBAL_NODES.filter(n => n.id !== 'ktm').map((node) => {
              const isSelected = activeNode.id === node.id;
              // Curved arc bezier path
              const midX = (origin.x + node.x) / 2;
              const midY = Math.min(origin.y, node.y) - 15;
              const d = `M ${origin.x}% ${origin.y}% Q ${midX}% ${midY}% ${node.x}% ${node.y}%`;

              return (
                <g key={`path-${node.id}`}>
                  <path
                    d={d}
                    fill="none"
                    stroke={isSelected ? 'var(--aiesec-blue-light)' : 'rgba(255, 255, 255, 0.12)'}
                    strokeWidth={isSelected ? '2.5' : '1'}
                    strokeDasharray={isSelected ? 'none' : '4 4'}
                    style={{ transition: 'all 0.3s ease' }}
                  />
                  {isSelected && (
                    <circle r="4" fill="#F5A623">
                      <animateMotion path={d} dur="3s" repeatCount="indefinite" />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Render Nodes */}
            {GLOBAL_NODES.map((node) => {
              const isSelected = activeNode.id === node.id;
              const isKathmandu = node.type === 'hub';

              return (
                <g
                  key={`node-${node.id}`}
                  transform={`translate(0, 0)`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveNode(node)}
                >
                  {/* Outer pulse */}
                  <circle
                    cx={`${node.x}%`}
                    cy={`${node.y}%`}
                    r={isKathmandu ? 12 : isSelected ? 9 : 6}
                    fill={isKathmandu ? 'rgba(245, 166, 35, 0.25)' : isSelected ? 'rgba(3, 126, 243, 0.3)' : 'rgba(255, 255, 255, 0.08)'}
                    stroke={isKathmandu ? 'var(--himalaya-gold)' : isSelected ? 'var(--aiesec-blue)' : 'rgba(255, 255, 255, 0.25)'}
                    strokeWidth="1.5"
                  />
                  {/* Core dot */}
                  <circle
                    cx={`${node.x}%`}
                    cy={`${node.y}%`}
                    r={isKathmandu ? 5 : isSelected ? 4 : 3}
                    fill={isKathmandu ? '#F5A623' : isSelected ? '#389BFF' : '#94A3B8'}
                  />
                  {/* Label */}
                  <text
                    x={`${node.x}%`}
                    y={`${node.y - 3}%`}
                    textAnchor="middle"
                    fill={isSelected ? '#FFFFFF' : 'var(--snow-muted)'}
                    fontSize="11"
                    fontWeight={isSelected ? '700' : '500'}
                    style={{ pointerEvents: 'none' }}
                  >
                    {node.city}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Active Node Detail Card Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              maxWidth: '380px',
              background: 'rgba(6, 14, 28, 0.88)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(3, 126, 243, 0.35)',
              borderRadius: '12px',
              padding: '14px 18px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#FFFFFF' }}>
                {activeNode.city}, {activeNode.country}
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: activeNode.type === 'hub' ? 'rgba(245, 166, 35, 0.2)' : 'rgba(3, 126, 243, 0.2)',
                  color: activeNode.type === 'hub' ? 'var(--himalaya-gold)' : '#389BFF',
                  fontWeight: 700,
                }}
              >
                {activeNode.type === 'hub' ? 'BASE CAMP' : 'GLOBAL NEXUS'}
              </span>
            </div>
            <p style={{ color: 'var(--snow-muted)', fontSize: '0.8rem', lineHeight: 1.45 }}>
              {activeNode.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
