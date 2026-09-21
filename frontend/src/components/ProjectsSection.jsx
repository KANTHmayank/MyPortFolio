import React from 'react';
import { ExternalLink, Sparkles, Layers, Cpu, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from './Icons';

export default function ProjectsSection({ onAskAboutProject }) {
  const projects = [
    {
      id: "petpuja",
      featured: true,
      title: "PetPuja – AI Dining Agent",
      date: "Sep 2026",
      badge: "Autonomous Agent • Flagship",
      description: "Architected an autonomous dining and order orchestration agent separating probabilistic LLM reasoning from deterministic backend business logic.",
      architecture: [
        "Separated LLM intent classification from deterministic backend nodes (validation, cooking, serving, inventory).",
        "Implemented Human-in-the-Loop (HITL) transactional workflows via LangGraph interrupt() and MemorySaver checkpointer.",
        "Engineered a self-healing fault-tolerant execution graph with per-item retries and a multi-model fallback cascade."
      ],
      technologies: ["LangGraph", "FastAPI", "Groq (GPT-OSS-20B/120B)", "MemorySaver", "Python"],
      github: "https://github.com/KANTHmayank/PetPuja/",
      liveDemo: "https://petpuja-928q.onrender.com/",
      promptQuery: "Explain the architecture of PetPuja, how LangGraph HITL interrupt() works, and the multi-model fallback cascade."
    },
    {
      id: "mail-classifier",
      featured: false,
      title: "AI Mail Classifier",
      date: "Oct 2025 – Nov 2025",
      badge: "Enterprise AI Pipeline",
      description: "Built an AI-powered email triage and classification system with high-throughput API endpoints and privacy-first preprocessing.",
      architecture: [
        "Implemented robust PII (Personally Identifiable Information) masking pipelines via regex prior to LLM inference.",
        "Engineered few-shot prompting strategies to boost classification accuracy across ambiguous customer support emails.",
        "Exposed asynchronous REST endpoints using FastAPI for real-time payload processing."
      ],
      technologies: ["Python", "FastAPI", "OpenAI GPT", "Regex", "Few-Shot Prompting"],
      github: "https://github.com/KANTHmayank/email-classifier",
      liveDemo: null,
      promptQuery: "How did Mayank implement PII masking and few-shot prompting in the AI Mail Classifier?"
    },
    {
      id: "vexura",
      featured: false,
      title: "VEXURA - Vehicle Insurance System",
      date: "Jul 2025 – Aug 2025",
      badge: "Full-Stack Enterprise",
      description: "Developed a full-stack vehicle insurance lifecycle management platform handling automated policy enrollment and claims processing.",
      architecture: [
        "Architected MVC architecture and RESTful APIs using Java and Spring MVC.",
        "Designed normalized MySQL database schema supporting multi-stage insurance policy lifecycles and claims audits.",
        "Built responsive client interface with HTML5, CSS3, and JavaScript."
      ],
      technologies: ["Java", "Spring MVC", "MySQL", "HTML5/CSS3", "REST APIs"],
      github: "https://github.com/KANTHmayank/VehicleInsurance",
      liveDemo: null,
      promptQuery: "Tell me about the VEXURA insurance system Mayank built with Spring MVC and MySQL."
    }
  ];

  return (
    <section id="projects" className="section-container">
      <div className="section-header">
        <span className="badge badge-tech">Engineering Portfolio</span>
        <h2 className="section-title">Featured Production & AI Projects</h2>
        <p className="section-subtitle">
          Real-world implementations spanning autonomous agent architectures, privacy-compliant LLM pipelines, and enterprise backend systems.
        </p>
      </div>

      <div className="projects-grid">
        {projects.map((proj) => (
          <div 
            key={proj.id} 
            className={`project-card glass-panel ${proj.featured ? 'project-card-featured' : ''}`}
            id={`project-card-${proj.id}`}
          >
            <div className="project-card-header">
              <div className="project-meta">
                <span className="project-badge">{proj.badge}</span>
                <span className="project-date">{proj.date}</span>
              </div>
              <h3 className="project-title">{proj.title}</h3>
              <p className="project-desc">{proj.description}</p>
            </div>

            <div className="project-architecture">
              <h4 className="arch-heading">Key Architectural Highlights:</h4>
              <ul className="arch-list">
                {proj.architecture.map((item, i) => (
                  <li key={i} className="arch-item">
                    <CheckCircle2 size={16} className="arch-icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="project-tech-tags">
              {proj.technologies.map((tech, i) => (
                <span key={i} className="badge-tech">{tech}</span>
              ))}
            </div>

            <div className="project-card-footer">
              <div className="project-links">
                {proj.github && (
                  <a 
                    href={proj.github} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-secondary btn-sm"
                    id={`btn-github-${proj.id}`}
                  >
                    <GithubIcon size={15} />
                    <span>Code</span>
                  </a>
                )}
                {proj.liveDemo && (
                  <a 
                    href={proj.liveDemo} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-primary btn-sm"
                    id={`btn-demo-${proj.id}`}
                  >
                    <ExternalLink size={15} />
                    <span>Live App</span>
                  </a>
                )}
              </div>

              <button 
                onClick={() => onAskAboutProject(proj.promptQuery)}
                className="btn-ask-ai"
                title="Ask AI about this project's technical architecture"
              >
                <Sparkles size={14} />
                <span>Ask AI</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
