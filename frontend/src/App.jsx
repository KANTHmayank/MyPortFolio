import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectsSection from './components/ProjectsSection';
import ExperienceSection from './components/ExperienceSection';
import SkillsSection from './components/SkillsSection';
import Footer from './components/Footer';
import ChatModal from './components/ChatModal';
import JDMatcherModal from './components/JDMatcherModal';
import WhyHireModal from './components/WhyHireModal';
import InterviewModal from './components/InterviewModal';
import IntroSplash from './components/IntroSplash';
import { Bot, Sparkles, Briefcase, HelpCircle } from 'lucide-react';
import './App.css';

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isJDMatcherOpen, setIsJDMatcherOpen] = useState(false);
  const [isWhyHireOpen, setIsWhyHireOpen] = useState(false);
  const [isInterviewOpen, setIsInterviewOpen] = useState(false);
  const [chatInitialQuery, setChatInitialQuery] = useState("");

  const handleOpenChatWithQuery = (query) => {
    setChatInitialQuery(query);
    setIsChatOpen(true);
  };

  const handleOpenChat = () => {
    setChatInitialQuery("");
    setIsChatOpen(true);
  };

  return (
    <div className="app-container">
      {/* Cinematic Intro Splash Screen */}
      <IntroSplash />

      {/* Top Navigation */}
      <Navbar 
        onOpenChat={handleOpenChat}
        onOpenJDMatcher={() => setIsJDMatcherOpen(true)}
        onOpenWhyHire={() => setIsWhyHireOpen(true)}
        onOpenInterview={() => setIsInterviewOpen(true)}
      />

      <main className="main-content">
        {/* Hero Section with PetPuja Flagship Video Showcase */}
        <Hero 
          onOpenChat={handleOpenChatWithQuery}
        />

        {/* Featured Projects */}
        <ProjectsSection 
          onAskAboutProject={handleOpenChatWithQuery}
        />

        {/* Experience & Education */}
        <ExperienceSection />

        {/* Skills & Tools */}
        <SkillsSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Single Clean Floating AI Assistant Trigger */}
      <div className="floating-actions">
        <button
          id="btn-floating-chat"
          onClick={handleOpenChat}
          className="floating-btn floating-chat-btn"
          title="Chat with Mayank's AI Copilot"
        >
          <div className="pulse-indicator"></div>
          <Bot size={20} />
          <span>Ask AI</span>
        </button>
      </div>

      {/* Interactive Modals */}
      <ChatModal 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialQuery={chatInitialQuery}
      />

      <JDMatcherModal 
        isOpen={isJDMatcherOpen}
        onClose={() => setIsJDMatcherOpen(false)}
      />

      <WhyHireModal
        isOpen={isWhyHireOpen}
        onClose={() => setIsWhyHireOpen(false)}
        onOpenChatWithQuery={handleOpenChatWithQuery}
      />

      <InterviewModal
        isOpen={isInterviewOpen}
        onClose={() => setIsInterviewOpen(false)}
        onAskQuestionInChat={handleOpenChatWithQuery}
      />
    </div>
  );
}

