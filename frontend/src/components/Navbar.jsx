import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Bot, FileText, Sun, Moon, Menu, X, 
  Sparkles, HelpCircle, Briefcase 
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, LeetcodeIcon } from './Icons';

export default function Navbar({ onOpenChat, onOpenJDMatcher, onOpenWhyHire, onOpenInterview }) {
  const [theme, setTheme] = useState('light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Detect currently set theme from document or localStorage
    const currentTheme = document.documentElement.getAttribute('data-theme') || 
      localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(currentTheme);
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  const handleMobileNavClick = (callback) => {
    setIsMobileMenuOpen(false);
    if (callback) callback();
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        <a href="#" className="navbar-brand" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="brand-avatar">
            <img 
              src="/profile.jpg" 
              alt="Mayank Kanth" 
              className="brand-avatar-img"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.nextSibling;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <span className="brand-avatar-fallback" style={{ display: 'none' }}>MK</span>
          </div>
          <div className="brand-info">
            <span className="brand-name">Mayank Kanth</span>
            <span className="brand-title">Backend & GenAI Engineer</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="navbar-links">
          <a href="#projects" className="nav-link">Projects</a>
          <a href="#experience" className="nav-link">Experience</a>
          <a href="#skills" className="nav-link">Skills</a>
          <button 
            id="btn-nav-why-hire"
            onClick={onOpenWhyHire} 
            className="nav-link nav-link-btn"
            title="Why Hire Mayank? Executive Briefing"
          >
            Why Hire?
          </button>
          <button 
            id="btn-nav-interview"
            onClick={onOpenInterview} 
            className="nav-link nav-link-btn"
            title="Technical & Architectural Interview Questions"
          >
            Interview Prep
          </button>
          <button 
            id="btn-nav-jd"
            onClick={onOpenJDMatcher} 
            className="nav-link nav-link-btn"
            title="Evaluate Job Description Match"
          >
            JD Matcher
          </button>
        </nav>

        {/* Navbar Actions */}
        <div className="navbar-actions">
          {/* Sun / Moon Theme Toggle (Always visible) */}
          <button
            id="btn-theme-toggle"
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label={theme === 'light' ? "Switch to sharp dark mode" : "Switch to warm light mode"}
            title={theme === 'light' ? "Switch to sharp dark mode" : "Switch to warm light mode"}
          >
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>

          {/* Desktop Only Actions */}
          <div className="navbar-desktop-actions">
            <a 
              href="/Mayank_Resume__.pdf" 
              download="Mayank_Kanth_Resume.pdf" 
              className="btn btn-secondary btn-sm"
              id="btn-download-resume"
              title="Download Mayank's Verified Resume PDF"
            >
              <FileText size={15} />
              <span>Resume</span>
            </a>

            <a 
              href="https://github.com/KANTHmayank" 
              target="_blank" 
              rel="noreferrer"
              className="social-icon-btn"
              id="nav-github-link"
              aria-label="GitHub Profile"
              title="Mayank's GitHub Profile"
            >
              <GithubIcon size={18} />
            </a>

            <a 
              href="https://www.linkedin.com/in/mayank-kanth-jan03/" 
              target="_blank" 
              rel="noreferrer"
              className="social-icon-btn"
              id="nav-linkedin-link"
              aria-label="LinkedIn Profile"
              title="Mayank's LinkedIn Profile"
            >
              <LinkedinIcon size={18} />
            </a>

            <a 
              href="https://leetcode.com/u/_mayank_kanth_/" 
              target="_blank" 
              rel="noreferrer"
              className="social-icon-btn"
              id="nav-leetcode-link"
              aria-label="LeetCode Profile"
              title="Mayank's LeetCode Profile"
            >
              <LeetcodeIcon size={18} />
            </a>

            <button 
              id="btn-nav-chat"
              onClick={onOpenChat} 
              className="btn btn-primary btn-sm"
              title="Chat with Mayank's AI Copilot"
            >
              <Bot size={16} />
              <span>AI Copilot</span>
            </button>
          </div>

          {/* Mobile Hamburger Menu Button (Visible on screens <= 768px) */}
          <button
            id="btn-mobile-menu-toggle"
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            title={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay via Portal to document.body */}
      {isMobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="mobile-menu-backdrop" 
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="mobile-menu-drawer glass-panel" 
            onClick={(e) => e.stopPropagation()}
            id="mobile-nav-drawer"
          >
            <div className="mobile-drawer-header">
              <span className="mobile-drawer-tag">[navigation // menu]</span>
              <button 
                className="mobile-drawer-close"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Section Anchors */}
            <div className="mobile-drawer-section">
              <span className="mobile-section-label">Sections</span>
              <nav className="mobile-nav-links">
                <a 
                  href="#projects" 
                  className="mobile-nav-link"
                  onClick={() => handleMobileNavClick()}
                >
                  <span>Featured Projects</span>
                  <span className="mobile-nav-arrow">→</span>
                </a>
                <a 
                  href="#experience" 
                  className="mobile-nav-link"
                  onClick={() => handleMobileNavClick()}
                >
                  <span>Experience & Education</span>
                  <span className="mobile-nav-arrow">→</span>
                </a>
                <a 
                  href="#skills" 
                  className="mobile-nav-link"
                  onClick={() => handleMobileNavClick()}
                >
                  <span>Skills & Architecture</span>
                  <span className="mobile-nav-arrow">→</span>
                </a>
              </nav>
            </div>

            {/* Interactive Features */}
            <div className="mobile-drawer-section">
              <span className="mobile-section-label">Interactive AI Tools</span>
              <div className="mobile-drawer-tools">
                <button 
                  className="mobile-tool-btn mobile-tool-why"
                  onClick={() => handleMobileNavClick(onOpenWhyHire)}
                >
                  <Sparkles size={16} className="text-amber" />
                  <div className="mobile-tool-text">
                    <span className="mobile-tool-title">Why Hire Mayank?</span>
                    <span className="mobile-tool-sub">Executive briefing & verified metrics</span>
                  </div>
                </button>

                <button 
                  className="mobile-tool-btn mobile-tool-interview"
                  onClick={() => handleMobileNavClick(onOpenInterview)}
                >
                  <HelpCircle size={16} className="text-purple" />
                  <div className="mobile-tool-text">
                    <span className="mobile-tool-title">Interview Prep</span>
                    <span className="mobile-tool-sub">Curated questions & model answers</span>
                  </div>
                </button>

                <button 
                  className="mobile-tool-btn mobile-tool-jd"
                  onClick={() => handleMobileNavClick(onOpenJDMatcher)}
                >
                  <Briefcase size={16} className="text-cyan" />
                  <div className="mobile-tool-text">
                    <span className="mobile-tool-title">JD Matcher</span>
                    <span className="mobile-tool-sub">Groq AI job fit analysis</span>
                  </div>
                </button>

                <button 
                  className="mobile-tool-btn mobile-tool-chat"
                  onClick={() => handleMobileNavClick(onOpenChat)}
                >
                  <Bot size={16} className="text-emerald" />
                  <div className="mobile-tool-text">
                    <span className="mobile-tool-title">Ask AI Copilot</span>
                    <span className="mobile-tool-sub">Live chat, voice STT & speech TTS</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Actions & Social */}
            <div className="mobile-drawer-section mobile-drawer-footer">
              <a 
                href="/Mayank_Resume__.pdf" 
                download="Mayank_Kanth_Resume.pdf" 
                className="btn btn-primary mobile-resume-btn"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FileText size={16} />
                <span>Download Resume (PDF)</span>
              </a>

              <div className="mobile-social-row">
                <a 
                  href="https://github.com/KANTHmayank" 
                  target="_blank" 
                  rel="noreferrer"
                  className="mobile-social-icon"
                  aria-label="GitHub Profile"
                >
                  <GithubIcon size={18} />
                  <span>GitHub</span>
                </a>
                <a 
                  href="https://www.linkedin.com/in/mayank-kanth-jan03/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="mobile-social-icon"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedinIcon size={18} />
                  <span>LinkedIn</span>
                </a>
                <a 
                  href="https://leetcode.com/u/_mayank_kanth_/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="mobile-social-icon"
                  aria-label="LeetCode Profile"
                >
                  <LeetcodeIcon size={18} />
                  <span>LeetCode</span>
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
