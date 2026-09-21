import React from 'react';
import { Mail, Phone, Code, FileText, Heart } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <div className="footer-brand-col">
          <h3 className="footer-brand">Mayank Kanth</h3>
          <p className="footer-tagline">
            Backend & Generative AI Engineer specializing in high-performance microservices, LangGraph autonomous workflows, and low-latency inference systems.
          </p>
          <div className="footer-contact-links">
            <a href="mailto:mayankkanth17@gmail.com" className="contact-link">
              <Mail size={15} />
              <span>mayankkanth17@gmail.com</span>
            </a>
            <a href="tel:+919953512186" className="contact-link">
              <Phone size={15} />
              <span>(+91) 9953512186</span>
            </a>
          </div>
        </div>

        <div className="footer-links-col">
          <h4 className="footer-col-title">Navigation</h4>
          <ul className="footer-nav">
            <li><a href="#projects">Featured Projects</a></li>
            <li><a href="#experience">Work Experience</a></li>
            <li><a href="#skills">Technical Competencies</a></li>
            <li><a href="/Mayank_Resume__.pdf" download="Mayank_Kanth_Resume.pdf">Download Resume (PDF)</a></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4 className="footer-col-title">Connect</h4>
          <ul className="footer-nav">
            <li>
              <a href="https://github.com/KANTHmayank" target="_blank" rel="noreferrer">
                <GithubIcon size={15} />
                <span>GitHub (@KANTHmayank)</span>
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/mayank-kanth-jan03/" target="_blank" rel="noreferrer">
                <LinkedinIcon size={15} />
                <span>LinkedIn Profile</span>
              </a>
            </li>
            <li>
              <a href="https://leetcode.com/u/_mayank_kanth_/" target="_blank" rel="noreferrer">
                <Code size={15} />
                <span>LeetCode Profile</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">
          © {new Date().getFullYear()} Mayank Kanth • Powered by React, FastAPI & Groq Cloud
        </p>
      </div>
    </footer>
  );
}
