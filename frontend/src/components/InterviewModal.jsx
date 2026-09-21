import React, { useState, useEffect } from 'react';
import { 
  X, HelpCircle, ChevronDown, ChevronUp, Bot, 
  Sparkles, ArrowRight, CheckCircle, Search, Filter 
} from 'lucide-react';

export default function InterviewModal({ isOpen, onClose, onAskQuestionInChat }) {
  const [questionsData, setQuestionsData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState("iq-1"); // Default expand first question
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchInterviewQuestions();
    }
  }, [isOpen]);

  const fetchInterviewQuestions = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/interview-questions');
      if (res.ok) {
        const data = await res.json();
        setQuestionsData(data);
      }
    } catch (e) {
      console.error("Failed to load interview questions:", e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const categories = questionsData?.categories || [
    "All",
    "LangGraph & Agentic AI",
    "Spring Boot & Backend Microservices",
    "System Design & Resilience"
  ];

  const allQuestions = questionsData?.questions || [];

  const filteredQuestions = allQuestions.filter(q => {
    const matchesCategory = selectedCategory === "All" || q.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.focus.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const handleAskInChat = (query) => {
    onClose();
    onAskQuestionInChat(query);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="interview-modal glass-panel"
        onClick={e => e.stopPropagation()}
        id="interview-modal"
      >
        {/* Header */}
        <div className="interview-header">
          <div className="interview-title-wrap">
            <div className="interview-badge">
              <Sparkles size={14} />
              <span>Resume-Grounded Questions</span>
            </div>
            <h2 className="interview-headline">
              Technical & Architecture <span className="gradient-text">Interview Prep</span>
            </h2>
            <p className="interview-sub">
              Realistic technical and architectural interview questions based on Mayank's verified engineering projects (including PetPuja, distributed microservices refactoring, and AI pipelines). Click any question to see the model answer guidelines or test Mayank's AI Copilot live.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="chat-action-btn chat-close-btn"
            id="btn-close-interview"
            title="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="interview-controls">
          <div className="interview-categories">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`cat-pill ${selectedCategory === cat ? 'cat-pill-active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="interview-search-bar">
            <Search size={15} className="search-icon" />
            <input 
              type="text"
              placeholder="Search interview questions by keyword..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="interview-search-input"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="btn-clear-search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Questions List */}
        <div className="interview-list">
          {isLoading ? (
            <div className="interview-loading">
              <Sparkles size={24} className="animate-spin text-purple" />
              <span>Loading curated interview questions...</span>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="interview-empty">
              <span>No questions found matching your filter.</span>
            </div>
          ) : (
            filteredQuestions.map(q => {
              const isExpanded = expandedId === q.id;
              return (
                <div 
                  key={q.id} 
                  className={`interview-card glass-card ${isExpanded ? 'interview-card-expanded' : ''}`}
                >
                  <div 
                    className="interview-card-head"
                    onClick={() => toggleExpand(q.id)}
                  >
                    <div className="iq-meta">
                      <span className={`iq-difficulty iq-diff-${q.difficulty.toLowerCase()}`}>
                        {q.difficulty}
                      </span>
                      <span className="iq-category-tag">{q.category}</span>
                    </div>

                    <h3 className="iq-question-text">{q.question}</h3>

                    <div className="iq-focus-line">
                      <span className="iq-focus-label">Assessing:</span>
                      <span className="iq-focus-val">{q.focus}</span>
                    </div>

                    <div className="iq-toggle-row">
                      <span className="iq-toggle-prompt">
                        {isExpanded ? "Hide answer guideline" : "View model answer guide"}
                      </span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="interview-card-body">
                      <div className="iq-guide-header">
                        <CheckCircle size={15} className="text-emerald" />
                        <span>Key Points Mayank Would Address:</span>
                      </div>
                      <ul className="iq-guide-points">
                        {q.key_points.map((pt, i) => (
                          <li key={i} className="iq-guide-item">
                            <span className="iq-bullet">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="iq-action-bar">
                        <button 
                          onClick={() => handleAskInChat(q.sample_query || q.question)}
                          className="btn btn-primary btn-sm"
                          title="Ask Mayank's AI Copilot this exact question"
                        >
                          <Bot size={15} />
                          <span>Ask AI Copilot this question</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="interview-footer">
          <span className="interview-footer-note">
            All questions assess verified competencies from Mayank's resume.
          </span>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
