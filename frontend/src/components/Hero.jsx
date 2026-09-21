import React, { useRef, useState } from 'react';
import { 
  Bot, FileText, ArrowRight, Zap, Database, Activity, 
  ShieldCheck, Sparkles, ExternalLink, Play, Pause 
} from 'lucide-react';
import { GithubIcon } from './Icons';

export default function Hero({ onOpenChat }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-badge-container">
        <span className="badge badge-hero">
          <span className="badge-light-text">Ready for new roles • Backend & GenAI</span>
          <span className="badge-dark-text">[ready for new roles // backend & genai]</span>
        </span>
      </div>

      <h1 className="hero-title">
        Engineering Scalable Microservices & <span className="gradient-text">Autonomous AI Agents</span>
      </h1>

      <p className="hero-subtitle">
        I am <strong>Mayank Kanth</strong>, a Computer Science professional with 1+ years of production experience 
        delivering high-throughput <strong>Spring Boot</strong> backends and cutting-edge <strong>LangGraph & Groq</strong> agentic workflows.
      </p>

      {/* Clean, Non-Redundant Hero Actions */}
      <div className="hero-actions">
        <button 
          id="btn-hero-chat"
          onClick={() => onOpenChat()} 
          className="btn btn-primary"
        >
          <Bot size={18} />
          <span>Ask My AI Copilot</span>
          <ArrowRight size={16} />
        </button>

        <a 
          href="/Mayank_Resume__.pdf" 
          download="Mayank_Kanth_Resume.pdf" 
          className="btn btn-secondary"
          id="btn-hero-resume"
        >
          <FileText size={18} />
          <span>Resume PDF</span>
        </a>
      </div>

      {/* Flagship Project Showcase: PetPuja Video Presentation */}
      <div className="petpuja-showcase-wrapper">
        <div className="petpuja-showcase-card glass-panel">
          {/* Mac-Style Window Header */}
          <div className="video-window-bar">
            <div className="window-dots">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <div className="window-title-box">
              <span className="window-title-badge">FLAGSHIP AGENT</span>
              <span className="window-title-text">PetPuja Live Demo • Autonomous LangGraph Food Agent</span>
            </div>
            <div className="window-status-pill">
              <span className="status-live-dot"></span>
              <span>Interactive Demo</span>
            </div>
          </div>

          {/* Video Player Display */}
          <div className="video-screen-container">
            <video 
              ref={videoRef}
              className="petpuja-video-player"
              src="/petpuja_demo.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline 
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>

          {/* Video Metadata & Project Highlights */}
          <div className="petpuja-showcase-details">
            <div className="petpuja-details-left">
              <div className="petpuja-details-header">
                <span className="project-badge">Autonomous Agent • Flagship</span>
                <h3 className="petpuja-project-heading">PetPuja – AI Dining & Ordering Agent</h3>
              </div>
              <p className="petpuja-project-summary">
                Autonomous agent architecture separating probabilistic LLM reasoning from deterministic backend execution. Features <strong>Human-in-the-Loop (HITL)</strong> interrupt() validation before order dispatch, <strong>MemorySaver</strong> state serialization, and self-healing multi-model fallback cascades on Groq.
              </p>
              <div className="petpuja-tech-chips">
                <span className="badge-tech">LangGraph</span>
                <span className="badge-tech">FastAPI</span>
                <span className="badge-tech">Groq (GPT-OSS-20B)</span>
                <span className="badge-tech">MemorySaver</span>
                <span className="badge-tech">HITL interrupt()</span>
                <span className="badge-tech">Python</span>
              </div>
            </div>

            <div className="petpuja-details-right">
              <button 
                onClick={() => onOpenChat("Explain the architecture of PetPuja, how LangGraph HITL interrupt() works, and the multi-model fallback cascade.")}
                className="btn btn-primary btn-sm"
                title="Ask AI Copilot about PetPuja architecture"
              >
                <Sparkles size={14} />
                <span>Ask AI About PetPuja</span>
              </button>

              <a 
                href="https://petpuja-928q.onrender.com/" 
                target="_blank" 
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
              >
                <span>Live App</span>
                <ExternalLink size={14} />
              </a>

              <a 
                href="https://github.com/KANTHmayank/PetPuja/" 
                target="_blank" 
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
              >
                <GithubIcon size={14} />
                <span>GitHub Code</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

