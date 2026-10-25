import React, { useState } from 'react';
import { X, Send, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('Founding Member (Student Leadership)');
  const [city, setCity] = useState('Kathmandu');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const existing = JSON.parse(localStorage.getItem('aiesec_nepal_signups') || '[]');
        existing.push({
          name,
          email,
          city,
          interest,
          date: new Date().toISOString(),
        });
        localStorage.setItem('aiesec_nepal_signups', JSON.stringify(existing));
      } catch {
        // storage fallback
      }

      setIsSubmitting(false);
      setIsSuccess(true);

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#037EF3', '#F5A623', '#E63946', '#FFFFFF'],
        });
      } catch {
        // optional
      }
    }, 500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'rgba(3, 7, 14, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '540px',
          borderRadius: '24px',
          padding: '36px',
          position: 'relative',
          background: 'linear-gradient(145deg, rgba(14, 24, 46, 0.95) 0%, rgba(5, 10, 20, 0.98) 100%)',
          border: '1px solid rgba(3, 126, 243, 0.3)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(3, 126, 243, 0.2)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--snow-muted)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--snow-muted)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          }}
        >
          <X size={18} />
        </button>

        {!isSuccess ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={16} style={{ color: 'var(--himalaya-gold)' }} />
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: 'var(--himalaya-gold)',
                  textTransform: 'uppercase',
                }}
              >
                AIESEC IN NEPAL • FOUNDING REGISTRY
              </span>
            </div>

            <h3
              className="font-heading"
              style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}
            >
              Be Part of the Journey
            </h3>
            <p style={{ color: 'var(--snow-muted)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.5 }}>
              Register for exclusive invitations to the launch ceremony, initial youth leadership cohorts, and international exchange openings.
            </p>

            {errorMsg && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(230, 57, 70, 0.15)',
                  border: '1px solid rgba(230, 57, 70, 0.4)',
                  color: '#FF8A8A',
                  fontSize: '0.84rem',
                  marginBottom: '16px',
                }}
              >
                <AlertCircle size={15} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--snow-muted)', marginBottom: '6px' }}>
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diya Shrestha"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(8, 15, 30, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    fontSize: '0.92rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--snow-muted)', marginBottom: '6px' }}>
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  required
                  placeholder="diya@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(8, 15, 30, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    fontSize: '0.92rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--snow-muted)', marginBottom: '6px' }}>
                    CITY
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: 'rgba(8, 15, 30, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  >
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Pokhara">Pokhara</option>
                    <option value="Lalitpur">Lalitpur</option>
                    <option value="Chitwan">Chitwan</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--snow-muted)', marginBottom: '6px' }}>
                    TRACK
                  </label>
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: 'rgba(8, 15, 30, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  >
                    <option value="Youth Member">Youth Member</option>
                    <option value="Global Volunteer">Global Volunteer</option>
                    <option value="Global Talent">Global Talent</option>
                    <option value="Partner">Organization / Partner</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ width: '100%', marginTop: '10px' }}
              >
                <Send size={16} />
                <span>{isSubmitting ? 'Confirming...' : 'Confirm Registration'}</span>
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(42, 157, 143, 0.2)',
                border: '1px solid rgba(42, 157, 143, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px auto',
                color: '#2A9D8F',
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h3 className="font-heading" style={{ fontSize: '1.7rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
              Namaste & Welcome!
            </h3>
            <p style={{ color: 'var(--snow-muted)', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Thank you, <strong>{name}</strong>. Your place in the founding community for <strong>{city}</strong> has been secured.
            </p>

            <button onClick={onClose} className="btn-primary" style={{ minWidth: '160px' }}>
              Return to Experience
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
