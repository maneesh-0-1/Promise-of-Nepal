import React, { useState } from 'react';
import { Send, CheckCircle2, Sparkles, Globe, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RegisteredUser {
  name: string;
  email: string;
  location: string;
  interest: string;
  date: string;
}

export const TheNextChapter: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: 'Kathmandu',
    interest: 'Join as Youth Member',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@') || !formData.email.includes('.')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Save to localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('aiesec_nepal_signups') || '[]');
        const newEntry: RegisteredUser = {
          ...formData,
          date: new Date().toISOString(),
        };
        existing.push(newEntry);
        localStorage.setItem('aiesec_nepal_signups', JSON.stringify(existing));
      } catch {
        // Fallback for private browsing
      }

      setIsSubmitting(false);
      setIsSuccess(true);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#037EF3', '#F5A623', '#E63946', '#FFFFFF', '#389BFF'],
        });
      } catch {
        // Confetti optional
      }
    }, 600);
  };

  return (
    <section
      id="the-next-chapter"
      style={{
        position: 'relative',
        zIndex: 20,
        padding: '120px 32px 140px 32px',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      <div
        className="glass-panel"
        style={{
          borderRadius: '32px',
          padding: 'clamp(36px, 6vw, 70px)',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(8, 16, 32, 0.85) 0%, rgba(4, 8, 16, 0.95) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Subtle Topographic Accent Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.08,
            backgroundImage: `radial-gradient(circle at 10% 20%, rgba(3, 126, 243, 0.8) 0%, transparent 40%),
                              radial-gradient(circle at 90% 80%, rgba(245, 166, 35, 0.6) 0%, transparent 40%)`,
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Section Eyebrow */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'rgba(245, 166, 35, 0.12)',
              border: '1px solid rgba(245, 166, 35, 0.35)',
              fontSize: '0.74rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: 'var(--himalaya-gold)',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            <Sparkles size={13} />
            <span>BE PART OF THE FOUNDING CHAPTER</span>
          </div>

          {/* Headline */}
          <h2
            className="font-heading"
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
              color: '#FFFFFF',
              marginBottom: '14px',
            }}
          >
            YOUR NEXT CHAPTER<br />
            <span className="gold-accent">STARTS HERE.</span>
          </h2>

          <p
            style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
              lineHeight: 1.5,
              color: 'var(--snow-muted)',
              marginBottom: '40px',
              fontWeight: 500,
            }}
          >
            AIESEC in Nepal. <span style={{ color: '#FFFFFF' }}>Coming soon.</span>
          </p>

          {/* Registration Form / Success State */}
          {!isSuccess ? (
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
                maxWidth: '680px',
              }}
            >
              {errorMsg && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(230, 57, 70, 0.15)',
                    border: '1px solid rgba(230, 57, 70, 0.4)',
                    color: '#FF8A8A',
                    fontSize: '0.86rem',
                  }}
                >
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '16px',
                }}
              >
                {/* Full Name */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--snow-muted)',
                      marginBottom: '6px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: 'rgba(12, 22, 42, 0.65)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '0.94rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--aiesec-blue)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--snow-muted)',
                      marginBottom: '6px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@university.edu.np"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: 'rgba(12, 22, 42, 0.65)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '0.94rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--aiesec-blue)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '16px',
                }}
              >
                {/* City / Hub in Nepal */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--snow-muted)',
                      marginBottom: '6px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    LOCATION IN NEPAL
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: 'rgba(12, 22, 42, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '0.94rem',
                      outline: 'none',
                    }}
                  >
                    <option value="Kathmandu Valley">Kathmandu Valley</option>
                    <option value="Pokhara">Pokhara</option>
                    <option value="Chitwan / Bharatpur">Chitwan / Bharatpur</option>
                    <option value="Dharan / Biratnagar">Dharan / Biratnagar</option>
                    <option value="Butwal / Bhairahawa">Butwal / Bhairahawa</option>
                    <option value="International / Diaspora">International / Diaspora</option>
                  </select>
                </div>

                {/* Interest Track */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--snow-muted)',
                      marginBottom: '6px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    HOW WOULD YOU LIKE TO ENGAGE?
                  </label>
                  <select
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: 'rgba(12, 22, 42, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '0.94rem',
                      outline: 'none',
                    }}
                  >
                    <option value="Join as Youth Member">Join as Youth Member (Founding Team)</option>
                    <option value="Global Volunteer Exchange">Global Volunteer (UN SDG Projects)</option>
                    <option value="Global Talent Internship">Global Talent (International Internships)</option>
                    <option value="Partner Organization / University">Partner Organization / University</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <div style={{ marginTop: '10px' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '16px 28px',
                    fontSize: '1.02rem',
                    cursor: isSubmitting ? 'wait' : 'pointer',
                  }}
                >
                  <Send size={18} />
                  <span>{isSubmitting ? 'Registering...' : 'Notify Me at Official Launch'}</span>
                </button>
              </div>

              <p style={{ fontSize: '0.76rem', color: 'var(--snow-dim)', textAlign: 'center', marginTop: '6px' }}>
                🔒 Your privacy is sacred. We will only contact you regarding the AIESEC in Nepal launch.
              </p>
            </form>
          ) : (
            /* Success Confirmation State */
            <div
              className="glass-card"
              style={{
                padding: '36px',
                borderRadius: '20px',
                border: '1px solid rgba(42, 157, 143, 0.5)',
                background: 'rgba(10, 30, 35, 0.65)',
                maxWidth: '620px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <CheckCircle2 size={32} style={{ color: '#2A9D8F' }} />
                <div>
                  <h3 className="font-heading" style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFFFFF' }}>
                    Welcome to the Himalayan Journey, {formData.name}!
                  </h3>
                  <p style={{ color: 'var(--snow-muted)', fontSize: '0.88rem' }}>
                    You are now on the official pre-launch registry for <strong>{formData.location}</strong>.
                  </p>
                </div>
              </div>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                When the physical base camp and initial recruitment window open across Nepal, you will receive direct early invitation access before the general public.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '9999px',
                  padding: '8px 18px',
                  color: '#FFFFFF',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Register another colleague
              </button>
            </div>
          )}

          {/* Official Social Links Container */}
          <div
            style={{
              marginTop: '56px',
              paddingTop: '32px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                CONNECT WITH AIESEC
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--snow-dim)' }}>
                Official channels for the Nepal expansion & international network
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <a
                href="https://www.instagram.com/aiesecglobal/"
                target="_blank"
                rel="noreferrer"
                title="Instagram @aiesecglobal"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--snow-white)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(230, 57, 70, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(230, 57, 70, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/company/aiesec/"
                target="_blank"
                rel="noreferrer"
                title="LinkedIn AIESEC"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--snow-white)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(3, 126, 243, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(3, 126, 243, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect width="4" height="12" x="2" y="9"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>

              <a
                href="https://www.facebook.com/AIESECglobal"
                target="_blank"
                rel="noreferrer"
                title="Facebook AIESEC Global"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--snow-white)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(3, 126, 243, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(3, 126, 243, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>

              <a
                href="https://aiesec.org"
                target="_blank"
                rel="noreferrer"
                title="AIESEC Global Portal"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--snow-white)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(245, 166, 35, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(245, 166, 35, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <Globe size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
