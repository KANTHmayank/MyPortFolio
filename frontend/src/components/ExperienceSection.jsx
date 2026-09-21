import React from 'react';
import { 
  Briefcase, GraduationCap, Award, Calendar, MapPin, 
  CheckCircle, Zap, Database, Activity, ShieldCheck, TrendingUp 
} from 'lucide-react';

export default function ExperienceSection() {
  const experiences = [
    {
      company: "Cognizant Technology Solutions",
      role: "Programmer Analyst",
      duration: "Jun 2025 – May 2026",
      location: "India",
      type: "Full-Time",
      impactMetrics: [
        {
          icon: <Zap size={18} className="metric-icon metric-purple" />,
          value: "~28%",
          label: "API Latency Reduction",
          subtext: "Spring Boot microservices async decoupling"
        },
        {
          icon: <Database size={18} className="metric-icon metric-cyan" />,
          value: "~40%",
          label: "SQL Execution Boost",
          subtext: "Composite indexes & query tuning on multi-million row DBs"
        },
        {
          icon: <Activity size={18} className="metric-icon metric-emerald" />,
          value: "~35%",
          label: "MTTR Decrease",
          subtext: "Distributed tracing & payload diagnostics across 12+ services"
        },
        {
          icon: <ShieldCheck size={18} className="metric-icon metric-amber" />,
          value: "99.9%",
          label: "Production Uptime",
          subtext: "Zero-downtime releases via automated CI/CD"
        }
      ],
      highlights: [
        "Optimized core business logic and RESTful endpoints across distributed Spring Boot microservices, resolving 50+ critical production defects and reducing average API latency by ~28%.",
        "Engineered and tuned complex SQL queries and indexing strategies across multi-million-row relational databases, accelerating query execution times by ~40% and resolving downstream data inconsistencies.",
        "Diagnosed and resolved end-to-end integration bottlenecks across 12+ microservices using distributed tracing and API payload validation (Postman, Splunk), slashing MTTR by ~35%.",
        "Collaborated in an Agile CI/CD environment (Git, Jenkins) to deliver bi-weekly production releases and critical zero-downtime hotfixes, maintaining 99.9% system uptime."
      ],
      skills: ["Spring Boot", "Java", "MySQL", "REST APIs", "Postman", "Splunk", "Git", "Jenkins", "Microservices"]
    },
    {
      company: "Quy Technology Pvt. Ltd.",
      role: "Software Engineer Trainee - AI/ML",
      duration: "Nov 2024 – Feb 2025",
      location: "India",
      type: "Internship / Trainee",
      highlights: [
        "Contributed to POC-based AI solutions, including a Hotel Booking AI Assistant using LLMs and vector search (AstraDB).",
        "Built Retrieval-Augmented Generation (RAG) systems using LangChain for high-precision document retrieval and semantic search.",
        "Designed FastAPI-based inference pipelines for real-time AI applications with low-latency response times."
      ],
      skills: ["Python", "FastAPI", "LangChain", "LLMs", "AstraDB", "RAG", "Vector Databases"]
    }
  ];

  return (
    <section id="experience" className="section-container">
      <div className="section-header">
        <span className="badge badge-tech">Track Record</span>
        <h2 className="section-title">Professional Experience & Education</h2>
        <p className="section-subtitle">
          Proven history of engineering reliable backend services and deploying scalable Generative AI architectures.
        </p>
      </div>

      <div className="timeline-container">
        {experiences.map((exp, idx) => (
          <div key={idx} className="timeline-item glass-panel">
            <div className="timeline-marker">
              <Briefcase size={18} />
            </div>

            <div className="timeline-content">
              <div className="timeline-header">
                <div>
                  <h3 className="timeline-role">{exp.role}</h3>
                  <h4 className="timeline-company">{exp.company}</h4>
                </div>
                <div className="timeline-meta">
                  <span className="meta-pill">
                    <Calendar size={13} />
                    {exp.duration}
                  </span>
                  <span className="meta-pill">
                    <MapPin size={13} />
                    {exp.location}
                  </span>
                </div>
              </div>

              {/* Cognizant Verified Production Impact Metrics */}
              {exp.impactMetrics && (
                <div className="cognizant-impact-wrapper">
                  <div className="impact-badge-row">
                    <TrendingUp size={14} className="text-cyan" />
                    <span className="impact-badge-label">Verified Production Impact Metrics</span>
                  </div>
                  <div className="cognizant-metrics-grid">
                    {exp.impactMetrics.map((m, mIdx) => (
                      <div key={mIdx} className="cognizant-metric-card glass-card">
                        <div className="cog-metric-top">
                          {m.icon}
                          <span className="cog-metric-val">{m.value}</span>
                        </div>
                        <span className="cog-metric-label">{m.label}</span>
                        <span className="cog-metric-sub">{m.subtext}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <ul className="timeline-highlights">
                {exp.highlights.map((h, i) => (
                  <li key={i} className="highlight-item">
                    <CheckCircle size={15} className="highlight-icon" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="timeline-skills">
                {exp.skills.map((s, i) => (
                  <span key={i} className="badge-tech">{s}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="credentials-grid">
        <div className="credential-card glass-panel">
          <div className="credential-icon edu-icon">
            <GraduationCap size={22} />
          </div>
          <div>
            <span className="badge badge-tech">B.Tech Degree</span>
            <h3 className="cred-title">Lingaya’s Vidyapeeth</h3>
            <p className="cred-desc">Bachelor of Technology in Computer Science & Engineering</p>
            <p className="cred-meta">Faridabad, Haryana • 2020 – 2024 • <strong>CGPA: 8.47 / 10.0</strong></p>
          </div>
        </div>

        <div className="credential-card glass-panel">
          <div className="credential-icon cert-icon">
            <Award size={22} />
          </div>
          <div>
            <span className="badge badge-tech">Certification</span>
            <h3 className="cred-title">AWS Cloud Practitioner Essentials</h3>
            <p className="cred-desc">Amazon Web Services (AWS)</p>
            <p className="cred-meta">Issued Oct 2025 • Cloud Fundamentals, Security & High Availability</p>
          </div>
        </div>
      </div>
    </section>
  );
}
