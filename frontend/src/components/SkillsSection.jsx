import React from 'react';
import { Cpu, Server, Database, Cloud, Terminal, Code2 } from 'lucide-react';

export default function SkillsSection() {
  const skillCategories = [
    {
      title: "Generative AI & LLM Systems",
      icon: <Cpu size={20} className="cat-icon icon-purple" />,
      skills: ["LangGraph", "LangChain", "Groq Cloud", "OpenAI GPT", "HuggingFace", "RAG Pipelines", "Human-in-the-Loop (HITL)", "Prompt Engineering", "Few-Shot Routing"]
    },
    {
      title: "Backend & Microservices",
      icon: <Server size={20} className="cat-icon icon-indigo" />,
      skills: ["Java", "Spring Boot", "FastAPI", "Spring MVC", "RESTful APIs", "Microservices Architecture", "Async Processing", "High Concurrency"]
    },
    {
      title: "Databases & Vector Stores",
      icon: <Database size={20} className="cat-icon icon-cyan" />,
      skills: ["MySQL", "SQL Indexing & Tuning", "Multi-Million Row DBs", "Vector Databases", "AstraDB", "Qdrant"]
    },
    {
      title: "Cloud, DevOps & Messaging",
      icon: <Cloud size={20} className="cat-icon icon-emerald" />,
      skills: ["AWS (EC2, S3, ELB)", "Kafka", "Redis", "Git", "GitHub", "Jenkins CI/CD", "Docker"]
    },
    {
      title: "AI Assistants & Developer Tooling",
      icon: <Terminal size={20} className="cat-icon icon-amber" />,
      skills: ["Claude Code", "AntiGravity", "Postman", "Splunk", "Distributed Tracing", "API Payload Validation", "Git / GitHub", "Swagger / OpenAPI"]
    },
    {
      title: "Core Engineering Principles",
      icon: <Code2 size={20} className="cat-icon icon-rose" />,
      skills: ["Object-Oriented Programming (OOP)", "Data Structures & Algorithms (DSA)", "High-Level System Design (HLD)", "Fault-Tolerant Patterns"]
    }
  ];

  return (
    <section id="skills" className="section-container">
      <div className="section-header">
        <span className="badge badge-tech">Core Competencies</span>
        <h2 className="section-title">Technical Skills & Tooling</h2>
        <p className="section-subtitle">
          Engineered across production backend architectures and cutting-edge generative AI orchestration frameworks.
        </p>
      </div>

      <div className="skills-grid">
        {skillCategories.map((cat, idx) => (
          <div key={idx} className="skill-cat-card glass-panel">
            <div className="skill-cat-header">
              {cat.icon}
              <h3 className="skill-cat-title">{cat.title}</h3>
            </div>
            <div className="skill-pills">
              {cat.skills.map((s, i) => (
                <span key={i} className="badge-tech skill-pill">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
