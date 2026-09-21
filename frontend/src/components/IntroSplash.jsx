import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function IntroSplash({ onFinish }) {
  const [stage, setStage] = useState('active'); // 'active' -> 'fading' -> 'hidden'

  useEffect(() => {
    // Stage 1: Display for 2.2 seconds
    const timer1 = setTimeout(() => {
      setStage('fading');
    }, 2200);

    // Stage 2: After fade-out animation completes (700ms), unmount
    const timer2 = setTimeout(() => {
      setStage('hidden');
      if (onFinish) onFinish();
    }, 2900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  const handleSkip = () => {
    setStage('fading');
    setTimeout(() => {
      setStage('hidden');
      if (onFinish) onFinish();
    }, 400);
  };

  if (stage === 'hidden') return null;

  return (
    <div className={`intro-splash-overlay ${stage === 'fading' ? 'intro-fading' : ''}`}>
      <div className="intro-content">
        {/* Glowing Profile Ring */}
        <div className="intro-avatar-wrapper">
          <div className="intro-halo-ring"></div>
          <img 
            src="/profile.jpg" 
            alt="Mayank Kanth" 
            className="intro-avatar-img"
            onError={(e) => {
              // Fallback to stylized initials if image missing
              e.target.style.display = 'none';
            }}
          />
        </div>

        {/* Candidate & AI Portfolio Branding */}
        <div className="intro-text-group">
          <h1 className="intro-name">Mayank Kanth</h1>
          <div className="intro-badge-wrap">
            <span className="intro-portfolio-badge">
              <Sparkles size={14} className="sparkle-icon" />
              <span>AI PORTFOLIO</span>
            </span>
          </div>
          <p className="intro-role">Backend & Generative AI Systems Engineer</p>
        </div>

        {/* Progress Bar / Entering Indicator */}
        <div className="intro-loader-track">
          <div className="intro-loader-bar"></div>
        </div>

        {/* Skip Button */}
        <button onClick={handleSkip} className="intro-skip-btn">
          <span>Enter Now</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
