import React, { useState, useEffect } from 'react';
import { 
  Briefcase, X, Sparkles, CheckCircle, AlertCircle, 
  ArrowRight, Copy, Check, Loader2, Award, Zap 
} from 'lucide-react';
import { API_BASE } from '../config';

export default function JDMatcherModal({ isOpen, onClose }) {
  const [sampleJDs, setSampleJDs] = useState({});
  const [selectedSample, setSelectedSample] = useState("ai_engineer");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch sample JDs on mount
  useEffect(() => {
    fetch(`${API_BASE}/api/sample-jds`)
      .then(res => res.json())
      .then(data => {
        setSampleJDs(data);
        if (data["ai_engineer"]) {
          loadSample("ai_engineer", data["ai_engineer"]);
        }
      })
      .catch(err => console.error("Could not fetch sample JDs:", err));
  }, []);

  const loadSample = (key, data) => {
    setSelectedSample(key);
    setJobTitle(data.title || "");
    setCompany(data.company || "");
    setJobDescription(data.description || "");
    setResult(null);
    setErrorMsg("");
  };

  const handleClear = () => {
    setSelectedSample("custom");
    setJobTitle("");
    setCompany("");
    setJobDescription("");
    setResult(null);
    setErrorMsg("");
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || jobDescription.trim().length < 20) {
      setErrorMsg("Please enter or paste at least 20 characters of the job description.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg("");
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/api/match-jd`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_title: jobTitle || undefined,
          company: company || undefined,
          job_description: jobDescription
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server returned error ${response.status}`);
      }

      const scorecard = await response.json();
      setResult(scorecard);
    } catch (err) {
      console.error("Analysis failed:", err);
      setErrorMsg(err.message || "Failed to analyze the job description. Please ensure the backend is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyPitch = () => {
    if (result?.tailored_pitch) {
      navigator.clipboard.writeText(result.tailored_pitch);
      setCopiedPitch(true);
      setTimeout(() => setCopiedPitch(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="jd-modal glass-panel"
        onClick={e => e.stopPropagation()}
        id="jd-matcher-modal"
      >
        {/* Header */}
        <div className="jd-modal-header">
          <div className="jd-header-info">
            <div className="jd-badge-icon">
              <Briefcase size={22} />
            </div>
            <div>
              <h2 className="jd-modal-title">Job Description Fit Matcher</h2>
              <p className="jd-modal-subtitle">
                Paste any job description or select a preset to evaluate candidate fit using Groq AI.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="chat-action-btn chat-close-btn"
            id="btn-close-jd"
            title="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="jd-modal-body">
          {/* Preset Buttons */}
          <div className="jd-preset-section">
            <span className="preset-label">1-Click Test Presets:</span>
            <div className="preset-buttons">
              <button
                type="button"
                className={`preset-btn ${selectedSample === 'ai_engineer' ? 'active' : ''}`}
                onClick={() => sampleJDs['ai_engineer'] && loadSample('ai_engineer', sampleJDs['ai_engineer'])}
              >
                <Sparkles size={14} />
                <span>AI / GenAI Engineer</span>
              </button>
              <button
                type="button"
                className={`preset-btn ${selectedSample === 'backend_engineer' ? 'active' : ''}`}
                onClick={() => sampleJDs['backend_engineer'] && loadSample('backend_engineer', sampleJDs['backend_engineer'])}
              >
                <Zap size={14} />
                <span>Backend (Spring Boot)</span>
              </button>
              <button
                type="button"
                className={`preset-btn ${selectedSample === 'fullstack_ai' ? 'active' : ''}`}
                onClick={() => sampleJDs['fullstack_ai'] && loadSample('fullstack_ai', sampleJDs['fullstack_ai'])}
              >
                <Award size={14} />
                <span>Full Stack AI Dev</span>
              </button>
              <button
                type="button"
                className={`preset-btn ${selectedSample === 'custom' ? 'active' : ''}`}
                onClick={handleClear}
              >
                <span>Custom / Clear</span>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="jd-form-row">
            <div className="jd-input-group">
              <label className="jd-label">Job Title (Optional)</label>
              <input
                type="text"
                className="jd-input"
                placeholder="e.g. Senior AI Engineer"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                disabled={isAnalyzing}
              />
            </div>
            <div className="jd-input-group">
              <label className="jd-label">Company Name (Optional)</label>
              <input
                type="text"
                className="jd-input"
                placeholder="e.g. OpenAI / Google / Meta"
                value={company}
                onChange={e => setCompany(e.target.value)}
                disabled={isAnalyzing}
              />
            </div>
          </div>

          <div className="jd-input-group">
            <label className="jd-label">Job Description Text</label>
            <textarea
              className="jd-textarea"
              rows={6}
              placeholder="Paste the full job requirements, qualifications, and responsibilities here..."
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              disabled={isAnalyzing}
            />
          </div>

          {errorMsg && (
            <div className="jd-error-banner">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="jd-action-bar">
            <button
              id="btn-analyze-jd"
              type="button"
              className="btn btn-primary"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !jobDescription.trim()}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={16} className="spinner" />
                  <span>Evaluating Candidate Fit with Groq...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Analyze Job Fit</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          {/* Scorecard Results */}
          {result && (
            <div className="jd-result-card glass-panel animate-fade-in" id="jd-scorecard-result">
              <div className="jd-score-header">
                <div className="score-radial">
                  <div className="score-number">{result.match_score}%</div>
                  <div className="score-label">MATCH SCORE</div>
                </div>
                <div className="score-summary">
                  <div className="verdict-tag">{result.verdict}</div>
                  <p className="recommendation-text">{result.recommendation}</p>
                </div>
              </div>

              {/* Skills Breakdown */}
              <div className="skills-breakdown-grid">
                <div className="skills-column matched-column">
                  <h4 className="column-title text-emerald">
                    <CheckCircle size={16} />
                    <span>Matched Skills ({result.matched_skills.length})</span>
                  </h4>
                  <div className="badge-cloud">
                    {result.matched_skills.map((s, i) => (
                      <span key={i} className="badge badge-emerald">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="skills-column growth-column">
                  <h4 className="column-title text-amber">
                    <AlertCircle size={16} />
                    <span>Growth / Unlisted Areas ({result.missing_or_growth_skills.length})</span>
                  </h4>
                  <div className="badge-cloud">
                    {result.missing_or_growth_skills.length > 0 ? (
                      result.missing_or_growth_skills.map((s, i) => (
                        <span key={i} className="badge badge-amber">{s}</span>
                      ))
                    ) : (
                      <span className="no-gaps">No missing core requirements!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Key Strengths */}
              {result.key_strengths && result.key_strengths.length > 0 && (
                <div className="jd-strengths-box">
                  <h4 className="strengths-title">Key Candidate Strengths for this Role:</h4>
                  <ul className="strengths-list">
                    {result.key_strengths.map((str, i) => (
                      <li key={i} className="strength-item">
                        <CheckCircle size={15} className="strength-icon text-emerald" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tailored Elevator Pitch */}
              {result.tailored_pitch && (
                <div className="tailored-pitch-box">
                  <div className="pitch-header">
                    <span className="pitch-title">Tailored Candidate Elevator Pitch</span>
                    <button 
                      onClick={handleCopyPitch}
                      className="btn-copy-pitch"
                      title="Copy elevator pitch"
                    >
                      {copiedPitch ? (
                        <>
                          <Check size={13} className="text-emerald" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy Pitch</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="pitch-content">"{result.tailored_pitch}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
