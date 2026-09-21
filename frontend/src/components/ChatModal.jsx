import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, X, Send, Trash2, Sparkles, Copy, Check, 
  Loader2, Minimize2, Maximize2, Mic, MicOff, 
  Volume2, Square, Languages 
} from 'lucide-react';

const SUGGESTIONS_EN = [
  "Can you describe Mayank's PetPuja project and its architecture?",
  "What measurable optimizations did Mayank deliver at Cognizant?",
  "How does Mayank implement Human-in-the-Loop (HITL) in LangGraph?",
  "Summarize Mayank's backend & GenAI experience in 2 sentences."
];

const SUGGESTIONS_HI = [
  "Mayank के PetPuja प्रोजेक्ट और उसके आर्किटेक्चर के बारे में बताएं?",
  "Cognizant में Mayank ने कौन-सी प्रमुख उपलब्धियां और latency सुधार हासिल किए?",
  "Mayank LangGraph में Human-in-the-Loop (HITL) कैसे लागू करते हैं?",
  "Mayank का बैकएंड और GenAI अनुभव 2 वाक्यों में संक्षेप में बताएं।"
];

export default function ChatModal({ isOpen, onClose, initialQuery }) {
  const [language, setLanguage] = useState("en"); // "en" | "hi"
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am Mayank Kanth's official AI Representative powered by **Groq** (`openai/gpt-oss-20b`). I can answer any questions about his backend microservices, LangGraph agent workflows, production metrics, or technical projects. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [sttSupported, setSttSupported] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Check speech recognition support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSttSupported(false);
    }
  }, []);

  // Handle opening and initial query
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      if (initialQuery) {
        handleSendMessage(initialQuery);
      }
    } else {
      // Cancel TTS and STT on close
      stopSpeaking();
      stopListening();
    }
  }, [isOpen, initialQuery]);

  // Stop TTS when unmounting or modal closes
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingIndex(null);
  };

  // Speech to text toggle
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech-to-Text is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInput(transcript);
        }
      };

      recognition.onerror = (err) => {
        console.warn("Speech recognition error:", err.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error("Failed to start speech recognition:", e);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  // Text to speech playback
  const handleToggleSpeak = (text, idx) => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    if (speakingIndex === idx) {
      stopSpeaking();
      return;
    }

    stopSpeaking();

    // Clean text of markdown syntax
    const cleanText = text
      .replace(/[*#`_~]/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/<.*?>/g, '')
      .replace(/•/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setSpeakingIndex(null);
    };
    utterance.onerror = () => {
      setSpeakingIndex(null);
    };

    setSpeakingIndex(idx);
    window.speechSynthesis.speak(utterance);
  };

  // Switch Language
  const handleLanguageToggle = () => {
    const nextLang = language === "en" ? "hi" : "en";
    setLanguage(nextLang);
    stopSpeaking();

    // Add a polite system acknowledgment message
    const greeting = nextLang === "hi" 
      ? "नमस्ते! मैंने हिन्दी भाषा चुन ली है। अब मैं Mayank Kanth के बैकएंड अनुभव, LangGraph एजेंट्स और प्रोजेक्ट्स के सभी उत्तर हिन्दी/हिंग्लिश में दूँगा। आप क्या जानना चाहेंगे?"
      : "Switched to English mode. Feel free to ask about Mayank's microservices, LangGraph architectures, Cognizant metrics, or technical projects!";

    setMessages(prev => [
      ...prev,
      { role: "assistant", content: greeting }
    ]);
  };

  const handleSendMessage = async (textToSend) => {
    const userQuery = (textToSend || input).trim();
    if (!userQuery || isStreaming) return;

    // Stop speaking if currently speaking
    stopSpeaking();
    stopListening();

    setInput("");

    // Append user message
    const updatedMessages = [...messages, { role: "user", content: userQuery }];
    setMessages(updatedMessages);

    // Prepare assistant placeholder message
    const assistantIndex = updatedMessages.length;
    setMessages([...updatedMessages, { role: "assistant", content: "" }]);
    setIsStreaming(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          stream: true,
          language: language
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedContent = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });
        const lines = chunkText.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr === '[DONE]') {
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.chunk) {
                accumulatedContent += parsed.chunk;
                setMessages(prev => {
                  const copy = [...prev];
                  copy[assistantIndex] = {
                    role: "assistant",
                    content: accumulatedContent
                  };
                  return copy;
                });
              } else if (parsed.error) {
                accumulatedContent += `\n\n*Error: ${parsed.error}*`;
                setMessages(prev => {
                  const copy = [...prev];
                  copy[assistantIndex] = {
                    role: "assistant",
                    content: accumulatedContent
                  };
                  return copy;
                });
              }
            } catch (e) {
              // Non-JSON SSE line, continue
            }
          }
        }
      }
    } catch (err) {
      console.error("Chat stream error:", err);
      setMessages(prev => {
        const copy = [...prev];
        copy[assistantIndex] = {
          role: "assistant",
          content: "Sorry, I encountered an issue communicating with the backend service. Please verify that the backend API is running."
        };
        return copy;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const handleCopy = (content, index) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClear = () => {
    if (isStreaming) return;
    stopSpeaking();
    stopListening();
    setMessages([
      {
        role: "assistant",
        content: language === "hi"
          ? "बातचीत रीसेट हो गई है। आप Mayank Kanth के बैकएंड इंजीनियरिंग और प्रोजेक्ट्स के बारे में कुछ भी पूछ सकते हैं!"
          : "Conversation refreshed. Ask me anything about Mayank's engineering background or projects!"
      }
    ]);
  };

  // Simple Markdown formatting parser (bold, bullet points, headers, inline code)
  const renderFormattedContent = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Header
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="msg-h4">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="msg-h3">{line.replace('## ', '')}</h3>;
      }
      // Bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const bulletText = line.trim().substring(2);
        return (
          <div key={idx} className="msg-bullet">
            <span className="msg-bullet-dot">•</span>
            <span>{parseInlineMarkdown(bulletText)}</span>
          </div>
        );
      }
      // Numbered lists
      if (/^\d+\.\s/.test(line.trim())) {
        const match = line.trim().match(/^(\d+\.)\s(.*)/);
        if (match) {
          return (
            <div key={idx} className="msg-bullet">
              <span className="msg-bullet-num">{match[1]}</span>
              <span>{parseInlineMarkdown(match[2])}</span>
            </div>
          );
        }
      }
      // Regular paragraph
      if (line.trim() === '') {
        return <div key={idx} className="msg-spacer" />;
      }
      return <p key={idx} className="msg-p">{parseInlineMarkdown(line)}</p>;
    });
  };

  const parseInlineMarkdown = (str) => {
    const parts = [];
    let remaining = str;
    const regex = /(\*\*.*?\*\*|`.*?`)/;
    let key = 0;

    while (remaining.length > 0) {
      const match = remaining.match(regex);
      if (!match) {
        parts.push(remaining);
        break;
      }
      const matchIndex = match.index;
      if (matchIndex > 0) {
        parts.push(remaining.substring(0, matchIndex));
      }
      const matchedText = match[0];
      if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
        parts.push(<strong key={key++}>{matchedText.slice(2, -2)}</strong>);
      } else if (matchedText.startsWith('`') && matchedText.endsWith('`')) {
        parts.push(<code key={key++} className="msg-code">{matchedText.slice(1, -1)}</code>);
      }
      remaining = remaining.substring(matchIndex + matchedText.length);
    }
    return parts;
  };

  const currentSuggestions = language === "hi" ? SUGGESTIONS_HI : SUGGESTIONS_EN;

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className={`chat-modal glass-panel ${isExpanded ? 'chat-modal-expanded' : ''}`}
        onClick={e => e.stopPropagation()}
        id="chat-copilot-modal"
      >
        {/* Header */}
        <div className="chat-modal-header">
          <div className="chat-header-info">
            <div className="chat-bot-avatar">
              <Bot size={20} />
            </div>
            <div>
              <div className="chat-header-title">
                <span>Mayank's AI Copilot</span>
                <span className="badge badge-pulse">
                  <span className="dot"></span>
                  Groq 20B
                </span>
              </div>
              <span className="chat-header-sub">Grounded exclusively on verified resume & projects</span>
            </div>
          </div>

          <div className="chat-header-actions">
            {/* Language Switcher Pill */}
            <button
              onClick={handleLanguageToggle}
              className={`lang-switch-btn ${language === 'hi' ? 'lang-hi-active' : ''}`}
              title={language === 'en' ? "Switch to Hindi (हिन्दी)" : "Switch to English"}
              id="btn-lang-toggle"
            >
              <Languages size={14} />
              <span>{language === 'en' ? '🇬🇧 EN' : '🇮🇳 हिन्दी'}</span>
            </button>

            <button 
              onClick={handleClear} 
              className="chat-action-btn"
              title="Clear conversation"
              disabled={isStreaming}
            >
              <Trash2 size={16} />
            </button>
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="chat-action-btn"
              title={isExpanded ? "Standard view" : "Expand view"}
            >
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button 
              onClick={onClose} 
              className="chat-action-btn chat-close-btn"
              id="btn-close-chat"
              title="Close chat"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Message List */}
        <div className="chat-messages-container">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`chat-message ${msg.role === 'user' ? 'chat-msg-user' : 'chat-msg-bot'} ${speakingIndex === idx ? 'chat-msg-speaking' : ''}`}
            >
              <div className="msg-avatar">
                {msg.role === 'user' ? 'You' : <Bot size={16} />}
              </div>
              <div className="msg-bubble">
                <div className="msg-text">
                  {renderFormattedContent(msg.content)}
                  {msg.role === 'assistant' && isStreaming && idx === messages.length - 1 && (
                    <span className="streaming-cursor"></span>
                  )}
                </div>

                {msg.role === 'assistant' && msg.content && (
                  <div className="msg-meta">
                    {/* TTS Speaker Button */}
                    <button
                      onClick={() => handleToggleSpeak(msg.content, idx)}
                      className={`btn-action-msg ${speakingIndex === idx ? 'btn-speaking-active' : ''}`}
                      title={speakingIndex === idx ? "Stop speaking" : "Listen to answer (Text-to-Speech)"}
                    >
                      {speakingIndex === idx ? (
                        <>
                          <Square size={12} className="text-amber animate-pulse" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 size={12} />
                          <span>Speak</span>
                        </>
                      )}
                    </button>

                    {/* Copy Button */}
                    <button 
                      onClick={() => handleCopy(msg.content, idx)}
                      className="btn-action-msg"
                      title="Copy response"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check size={12} className="text-emerald" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Question Chips */}
        {messages.length <= 2 && (
          <div className="chat-suggestions">
            <div className="suggestions-label">
              <Sparkles size={13} />
              <span>{language === 'hi' ? 'सुझाए गए प्रश्न:' : 'Suggested questions:'}</span>
            </div>
            <div className="suggestions-scroll">
              {currentSuggestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(q)}
                  className="suggestion-chip"
                  disabled={isStreaming}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="chat-input-bar">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="chat-input-form"
          >
            <input
              ref={inputRef}
              id="chat-input-field"
              type="text"
              placeholder={
                isListening 
                  ? (language === 'hi' ? 'सुन रहा हूँ... बोलिए' : 'Listening... speak now')
                  : isStreaming 
                    ? (language === 'hi' ? 'AI विचार कर रहा है...' : 'AI is reasoning and streaming response...') 
                    : (language === 'hi' ? 'PetPuja, Cognizant, या AI स्किल्स के बारे में पूछें...' : 'Ask about PetPuja, Cognizant metrics, microservices, or AI skills...')
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isStreaming}
              className={`chat-input ${isListening ? 'chat-input-listening' : ''}`}
            />

            {/* STT Microphone Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`btn-mic ${isListening ? 'btn-mic-active' : ''}`}
              title={isListening ? "Stop listening" : "Voice input (Speech-to-Text)"}
              disabled={isStreaming}
              id="btn-voice-input"
            >
              {isListening ? (
                <MicOff size={16} className="text-rose animate-pulse" />
              ) : (
                <Mic size={16} />
              )}
            </button>

            <button
              id="btn-send-chat"
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="btn-send"
              title="Send question"
            >
              {isStreaming ? (
                <Loader2 size={16} className="spinner" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </form>
          <div className="chat-disclaimer">
            {language === 'hi' 
              ? 'शून्य भ्रामकता • केवल Mayank Kanth के सत्यापित प्रोफाइल डेटा पर आधारित' 
              : 'Zero hallucinations • Grounded in Mayank Kanth\'s verified profile data'}
          </div>
        </div>
      </div>
    </div>
  );
}
