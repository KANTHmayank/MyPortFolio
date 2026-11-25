import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, Check, Copy, Bot, ArrowRight, Zap, 
  BrainCircuit, Code2, ShieldCheck, TrendingUp, Award, CheckCircle2 
} from 'lucide-react';
import { API_BASE } from '../config';

export default function WhyHireModal({ isOpen, onClose, onOpenChatWithQuery }) {
  const [copied, setCopied] = useState(false);
  const [leetcodeData, setLeetcodeData] = useState(null);

  useEffect(() => {
    if (isOpen && !leetcodeData) {
      fetch(`${API_BASE}/api/leetcode`)
        .then(res => (res.ok ? res.json() : null))
        .then(data => {
          if (data && data.total_solved) setLeetcodeData(data);
        })
        .catch(() => {});
    }
  }, [isOpen, leetcodeData]);

  if (!isOpen) return null;

  const lcTotal = leetcodeData?.total_solved ?? 176;
  const lcDiff = leetcodeData?.difficulty_breakdown || { Easy: 54, Medium: 101, Hard: 21 };
  const lcTopics = leetcodeData?.top_topics?.slice(0, 4).map(t => t.topic).join(', ') || 'Arrays, Binary Search, DP, Two Pointers';

  const executivePitch = 
    `Mayank Kanth delivers a rare dual-competency: production-proven backend engineering (1+ year resolving 50+ defects across distributed microservices, ~28% API latency cut & ~40% SQL speedup at Cognizant, plus Java 17/Spring Boot, Redis idempotency & ECDSA/AES-GCM cryptography in KahinPAY) combined with state-of-the-art GenAI engineering (LangGraph HITL workflows, RAG pipelines, FastAPI SSE streaming, and sub-second Groq LPUs). With ${lcTotal}+ LeetCode problems solved (${lcDiff.Medium} Medium, ${lcDiff.Hard} Hard) and an 8.47 CGPA in B.Tech CSE, Mayank brings immediate velocity and architectural rigor.`;

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(executivePitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleChatDeepDive = (query) => {
    onClose();
    onOpenChatWithQuery(query);
  };

  const metrics = [
    { label: "API Latency Reduction", val: "~28%", sub: "Microservices & REST API tuning at Cognizant" },
    { label: "SQL Query Speedup", val: "~40%", sub: "Index tuning on multi-million row tables" },
    { label: "MTTR Reduction", val: "~35%", sub: "Distributed tracing, Splunk & Postman" },
    { label: "Production Uptime", val: "99.9%", sub: "Git CI/CD & AWS (EC2, S3, ELB) releases" },
    { label: "LeetCode Solved", val: `${lcTotal}+`, sub: `${lcDiff.Easy}E / ${lcDiff.Medium}M / ${lcDiff.Hard}H • ${lcTopics}` },
    { label: "Academic CGPA", val: "8.47", sub: "B.Tech Computer Science & Engineering" }
  ];

  const pillars = [
    {
      icon: <Zap className="pillar-icon text-amber" size={24} />,
      badge: "Proven Velocity",
      title: "Immediate Enterprise Production Velocity",
      subtitle: "Distributed Microservices, SQL Tuning & Java / Spring Boot",
      items: [
        "1+ year of production engineering at Cognizant resolving 50+ defects across distributed microservices (~28% latency cut, ~40% SQL boost, ~35% MTTR reduction).",
        "Architected KahinPAY: an offline-first distributed UPI payment engine (Java 17, Spring Boot, Redis) with simulated BLE epidemic gossip, ECDSA + RSA-2048/AES-256-GCM encryption, and Redis SETNX idempotency.",
        "Containerization with Docker, automated Git CI/CD pipelines across AWS (EC2, S3, ELB), 99.9% production reliability, and daily AI-assisted velocity via Claude Code."
      ],
      chatPrompt: "Detail Mayank's microservices & SQL optimizations at Cognizant and the distributed architecture of KahinPAY."
    },
    {
      icon: <BrainCircuit className="pillar-icon text-cyan" size={24} />,
      badge: "Next-Gen AI",
      title: "Cutting-Edge Generative AI & Agentic Systems",
      subtitle: "LangGraph Multi-Agent Workflows, RAG & FastAPI",
      items: [
        "Architected PetPuja (solo flagship agent): Multi-agent dining orchestrator with stateful graphs, Human-in-the-Loop (HITL) interrupt() workflows, and MemorySaver state checkpointer.",
        "Built the Autonomous Candidate AI Copilot platform: FastAPI + Groq SSE streaming (~300ms TTFT), sliding-window memory, prompt injection defenses, and multimodal Web Speech STT/TTS.",
        "Engineered RAG-based systems at Quy Technology using LangChain and AstraDB vector search for real-time document retrieval and AI assistants."
      ],
      chatPrompt: "Explain how Mayank implements Human-in-the-Loop (HITL) workflows and fallback cascades in LangGraph."
    },
    {
      icon: <Code2 className="pillar-icon text-emerald" size={24} />,
      badge: "Rigorous Fundamentals",
      title: "Deep Algorithmic Discipline & Technical Ownership",
      subtitle: "High Problem-Solving Acumen & Rapid Learning Agility",
      items: [
        `${lcTotal}+ problems solved on LeetCode (${lcDiff.Easy} Easy, ${lcDiff.Medium} Medium, ${lcDiff.Hard} Hard) focusing on ${lcTopics}, Greedy/Heaps, Trees, and Graphs.`,
        "8.47 CGPA in B.Tech Computer Science & Engineering demonstrating strong analytical discipline and solid computational fundamentals.",
        "High engineering hygiene: writes Pydantic validation schemas, clean documentation, and observable telemetry."
      ],
      chatPrompt: "Tell me about Mayank's LeetCode stats, recent questions solved, and preferred DSA topics."
    }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="why-hire-modal glass-panel"
        onClick={(e) => e.stopPropagation()}
        id="why-hire-modal"
      >
        {/* Header */}
        <div className="why-hire-header">
          <div className="why-hire-title-wrap">
            <div className="why-hire-badge">
              <Sparkles size={14} />
              <span>Executive Recruiter Briefing</span>
            </div>
            <h2 className="why-hire-headline">
              Why Hire <span className="gradient-text">Mayank Kanth</span>?
            </h2>
            <p className="why-hire-sub">
              A high-impact engineer bridging enterprise backend resilience with autonomous AI agent architectures.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="chat-action-btn chat-close-btn"
            id="btn-close-why-hire"
            title="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="why-hire-content">
          {/* Executive Pitch Box */}
          <div className="executive-pitch-box glass-card">
            <div className="pitch-header">
              <span className="pitch-tag">
                <Award size={14} className="text-amber" />
                30-Second Executive Summary
              </span>
              <button 
                onClick={handleCopyPitch}
                className="btn-copy-pitch"
                title="Copy executive pitch to clipboard"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-emerald" />
                    <span>Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Pitch</span>
                  </>
                )}
              </button>
            </div>
            <p className="pitch-text">
              "{executivePitch}"
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="why-hire-metrics-grid">
            {metrics.map((m, idx) => (
              <div key={idx} className="why-metric-card">
                <span className="why-metric-val">{m.val}</span>
                <span className="why-metric-label">{m.label}</span>
                <span className="why-metric-sub">{m.sub}</span>
              </div>
            ))}
          </div>

          {/* 3 Core Pillars */}
          <div className="pillars-container">
            <h3 className="pillars-section-title">The Three Pillars of Value</h3>
            <div className="pillars-list">
              {pillars.map((pillar, i) => (
                <div key={i} className="pillar-card glass-card">
                  <div className="pillar-top">
                    <div className="pillar-header-left">
                      {pillar.icon}
                      <div>
                        <div className="pillar-badge">{pillar.badge}</div>
                        <h4 className="pillar-title">{pillar.title}</h4>
                        <span className="pillar-subtitle">{pillar.subtitle}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleChatDeepDive(pillar.chatPrompt)}
                      className="btn-pillar-chat"
                      title="Ask AI Copilot for more details"
                    >
                      <Bot size={14} />
                      <span>Ask AI</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                  <ul className="pillar-items">
                    {pillar.items.map((item, j) => (
                      <li key={j} className="pillar-item">
                        <CheckCircle2 size={16} className="text-cyan pillar-check" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="why-hire-footer">
          <button 
            onClick={() => handleChatDeepDive("Give me an executive summary of why Mayank is an outstanding candidate for a Backend / GenAI role.")}
            className="btn btn-primary"
          >
            <Bot size={16} />
            <span>Deep Dive with AI Copilot</span>
            <ArrowRight size={15} />
          </button>
          <a 
            href="/Mayank_Resume_SDE.pdf" 
            download="Mayank_Kanth_Backend_Resume.pdf" 
            className="btn btn-secondary"
          >
            Backend / SDE Resume
          </a>
          <a 
            href="/Mayank_Resume_AI.pdf" 
            download="Mayank_Kanth_AI_Resume.pdf" 
            className="btn btn-secondary"
          >
            AI / GenAI Resume
          </a>
        </div>
      </div>
    </div>
  );
}
