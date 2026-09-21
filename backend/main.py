import os
import json
import time
from typing import List, Optional
from pathlib import Path
from dotenv import load_dotenv

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel, Field

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from backend.schema import CandidateProfile
from backend.agent import get_profile, stream_candidate, ask_candidate, DEFAULT_MODEL
from backend.matcher import (
    JDMatchRequest,
    JDMatchResponse,
    match_job_description,
    SAMPLE_JOB_DESCRIPTIONS
)

load_dotenv()

# Rate limiting: 60/min default, stricter limits on LLM endpoints
limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])

app = FastAPI(
    title="Mayank Kanth - AI Portfolio API",
    description="Backend services for Mayank Kanth's AI Portfolio: Chatbot, SSE Streaming, and JD Matcher.",
    version="1.0.0"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS setup
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]
custom_origin = os.getenv("FRONTEND_URL")
if custom_origin:
    allowed_origins.append(custom_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if os.getenv("ALLOW_ALL_CORS", "true").lower() == "true" else allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    content: str = Field(..., description="Message text content")


class ChatRequest(BaseModel):
    messages: List[ChatMessage] = Field(..., min_items=1, description="Conversation history")
    stream: bool = Field(default=True, description="Whether to stream response tokens via SSE")
    language: Optional[str] = Field(default="en", description="Preferred response language ('en' or 'hi')")


@app.get("/")
def root():
    return {
        "candidate": "Mayank Kanth",
        "title": "Backend & Generative AI Engineer",
        "service": "AI Portfolio API",
        "docs": "/docs",
        "health": "/api/health"
    }


@app.get("/api/health")
def health_check():
    """Health check endpoint used by Render / UptimeRobot to keep the service awake."""
    return {
        "status": "healthy",
        "model": DEFAULT_MODEL,
        "timestamp": time.time(),
        "candidate": "Mayank Kanth"
    }


@app.get("/api/profile", response_model=CandidateProfile)
def get_candidate_profile():
    """Returns Mayank's verified structured profile for frontend rendering."""
    return get_profile()


@app.get("/api/sample-jds")
def get_sample_job_descriptions():
    """Returns curated real-world sample JDs for 1-click recruiter testing."""
    return SAMPLE_JOB_DESCRIPTIONS


@app.get("/api/why-hire")
def get_why_hire_data():
    """
    Returns executive-level hire scorecard and structured pitch pillars
    for engineering hiring managers and recruiters.
    """
    profile = get_profile()
    return {
        "headline": "Why Mayank Kanth is an Exceptional Backend & GenAI Engineer",
        "summary": "Mayank bridges the high-demand gap between enterprise-grade backend reliability (Java/Spring Boot, 99.9% uptime, ~28% latency cut at Cognizant) and modern autonomous AI agent architectures (LangGraph, FastAPI, Groq LPUs).",
        "metrics": [
            {
                "label": "API Latency Reduction",
                "value": "~28%",
                "context": "Refactored Spring Boot microservices & decoupled synchronous bottlenecks at Cognizant"
            },
            {
                "label": "SQL Query Boost",
                "value": "~40%",
                "context": "Tuned composite indexes & execution plans on high-volume production tables"
            },
            {
                "label": "MTTR Decrease",
                "value": "~35%",
                "context": "Implemented distributed tracing across 12+ microservices for rapid root cause diagnosis"
            },
            {
                "label": "Production Uptime",
                "value": "99.9%",
                "context": "Zero-downtime releases and resilient fault isolation via automated CI/CD"
            },
            {
                "label": "LeetCode Problems",
                "value": "150+",
                "context": "Solved 150+ problems spanning arrays, stacks, queues, linked lists to trees and dynamic programming"
            },
            {
                "label": "Academic Foundation",
                "value": "8.47 CGPA",
                "context": "B.Tech in Computer Science & Engineering with first-class honors"
            }
        ],
        "pillars": [
            {
                "id": "velocity",
                "title": "Immediate Production Velocity",
                "subtitle": "Enterprise Java, Spring Boot & Scalable Microservices",
                "badge": "Proven Enterprise Experience",
                "points": [
                    "Over 1 year of hands-on production engineering at Cognizant building robust RESTful microservices, API gateways, and distributed services.",
                    "Demonstrated performance engineering: delivered a ~28% latency reduction through asynchronous execution and HikariCP connection pool tuning.",
                    "Production discipline: Docker containerization, CI/CD automated test gates, and continuous 99.9% service reliability."
                ]
            },
            {
                "id": "genai",
                "title": "Cutting-Edge Generative AI Specialization",
                "subtitle": "LangGraph Stateful Agents & Sub-Second Groq LPUs",
                "badge": "Next-Gen AI Engineering",
                "points": [
                    "Architected PetPuja: Multi-agent food ordering system with stateful graphs, Human-in-the-Loop (HITL) interrupt() checkpoints, and MemorySaver state serialization.",
                    "Engineered multi-model fallback cascades preventing 429 rate limit outages during high-load traffic surges.",
                    "Strict boundary separation between probabilistic LLM reasoning and deterministic transactional execution (payments, orders)."
                ]
            },
            {
                "id": "fundamentals",
                "title": "Rigorous Problem Solving & Ownership",
                "subtitle": "Algorithmic Precision & Fast Architectural Mastery",
                "badge": "Top 10% Fundamentals",
                "points": [
                    "150+ problems solved on LeetCode covering arrays, stacks, queues, linked lists, trees, and dynamic programming.",
                    "8.47 CGPA in B.Tech Computer Science & Engineering demonstrating solid analytical foundations and disciplined execution.",
                    "High engineering hygiene: writes Pydantic validation schemas, clean documentation, and observable telemetry."
                ]
            }
        ],
        "executive_pitch": (
            "If your team needs an engineer who can hit the ground running on distributed Spring Boot or Python backends today, "
            "while architecting autonomous, resilient AI agent workflows tomorrow, Mayank Kanth brings immediate production velocity, "
            "deep technical ownership, and verified engineering results."
        ),
        "social_links": profile.personal.social_links.model_dump()
    }


@app.get("/api/interview-questions")
def get_interview_questions():
    """
    Curated, realistic technical & architectural interview questions
    generated directly from Mayank's verified resume and projects.
    """
    return {
        "candidate": "Mayank Kanth",
        "description": "Technical and architectural interview questions tailored to Mayank's verified engineering projects and architectures.",
        "categories": [
            "All",
            "LangGraph & Agentic AI",
            "Spring Boot & Backend Microservices",
            "System Design & Resilience"
        ],
        "questions": [
            {
                "id": "iq-1",
                "category": "LangGraph & Agentic AI",
                "difficulty": "Hard",
                "question": "In your PetPuja project, how did you implement Human-in-the-Loop (HITL) workflows and why was an interrupt pattern necessary?",
                "focus": "Stateful agent graphs, user confirmation checkpoints, deterministic vs. probabilistic boundaries",
                "key_points": [
                    "LangGraph interrupt() mechanism pauses the graph before irreversible actions (e.g. final order placement or payment debit).",
                    "MemorySaver checkpointer serializes conversational and order state to disk/memory so the session resumes seamlessly upon human feedback.",
                    "Prevents hallucinated or unauthorized transactions by decoupling intent interpretation from order execution."
                ],
                "sample_query": "Explain how PetPuja implements Human-in-the-Loop interrupt workflows and state checkpoints."
            },
            {
                "id": "iq-2",
                "category": "LangGraph & Agentic AI",
                "difficulty": "Medium",
                "question": "How do you handle LLM inference latency and provider rate limits when deploying agents in production?",
                "focus": "Groq LPU acceleration, token streaming, multi-model fallback cascades",
                "key_points": [
                    "Utilizing Groq's LPU architecture (e.g. openai/gpt-oss-20b) to deliver sub-second reasoning and token generation.",
                    "Implementing Server-Sent Events (SSE) streaming so end users receive first-token responses in under ~200ms.",
                    "Designing an automated multi-model fallback cascade: if the primary provider hits 429 rate limits or 503 errors, the graph falls back to secondary models without dropping conversation state."
                ],
                "sample_query": "How do you handle LLM inference latency and multi-model fallbacks in your agent projects?"
            },
            {
                "id": "iq-3",
                "category": "Spring Boot & Backend Microservices",
                "difficulty": "Hard",
                "question": "How did you achieve a ~28% reduction in API latency across distributed Spring Boot microservices?",
                "focus": "Microservices profiling, async task delegation, connection pool tuning",
                "key_points": [
                    "Identified latency bottlenecks through APM distributed tracing, isolating slow database lookups and synchronous downstream calls.",
                    "Decoupled non-critical paths (audit logging, notification dispatch, metrics aggregation) into asynchronous background tasks using @Async and CompletableFuture.",
                    "Optimized HikariCP connection pool configurations and replaced bloated JPA entity object graph queries with lightweight DTO projections."
                ],
                "sample_query": "Walk me through how Mayank achieved a 28% latency reduction in his Spring Boot microservices project."
            },
            {
                "id": "iq-4",
                "category": "Spring Boot & Backend Microservices",
                "difficulty": "Medium",
                "question": "What techniques did you apply to accelerate SQL execution by ~40% on production databases?",
                "focus": "Database indexing, query execution plan analysis, eliminating N+1 bottlenecks",
                "key_points": [
                    "Analyzed query execution plans using EXPLAIN ANALYZE to identify sequential full-table scans on high-cardinality columns.",
                    "Designed composite and covering indexes tailored specifically to frequent JOIN and WHERE query predicates.",
                    "Eliminated Hibernate N+1 query traps by using explicit JOIN FETCH and batch loading strategies."
                ],
                "sample_query": "How did Mayank optimize SQL queries to achieve a 40% execution boost in production databases?"
            },
            {
                "id": "iq-5",
                "category": "System Design & Resilience",
                "difficulty": "Medium",
                "question": "How did you maintain 99.9% uptime and reduce MTTR by ~35% across 12+ microservices?",
                "focus": "Distributed tracing, telemetry, automated CI/CD pipelines, fault isolation",
                "key_points": [
                    "Propagated distributed correlation/trace IDs (e.g. Sleuth/Zipkin/OpenTelemetry) across service boundaries to instantly pinpoint failing hops.",
                    "Enforced circuit breaker and timeout patterns to prevent cascading failures across dependent microservices.",
                    "Standardized CI/CD test gates requiring 100% passing unit and integration suites before automated deployment."
                ],
                "sample_query": "How did Mayank maintain 99.9% uptime and cut MTTR by 35% across microservices?"
            }
        ]
    }



@app.post("/api/chat")
@limiter.limit("20/minute")
async def chat_endpoint(request: Request, body: ChatRequest):
    """
    Conversational AI representative endpoint.
    Maintains memory via sliding window (last 10 messages).
    Streams tokens via Server-Sent Events (SSE) by default.
    Supports English ('en') and Hindi ('hi') language modes.
    """
    if not body.messages:
        raise HTTPException(status_code=400, detail="Messages array cannot be empty.")

    # Sliding window memory: take last 10 messages
    windowed_messages = [
        {"role": m.role, "content": m.content}
        for m in body.messages[-10:]
    ]
    lang = body.language or "en"

    if not body.stream:
        content = ask_candidate(windowed_messages, language=lang)
        return {"content": content, "model": DEFAULT_MODEL, "language": lang}

    def event_generator():
        try:
            for token in stream_candidate(windowed_messages, language=lang):
                payload = json.dumps({"chunk": token})
                yield f"data: {payload}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            error_payload = json.dumps({"error": str(e)})
            yield f"data: {error_payload}\n\n"
            yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


@app.post("/api/match-jd", response_model=JDMatchResponse)
@limiter.limit("10/minute")
async def match_jd_endpoint(request: Request, body: JDMatchRequest):
    """
    Evaluates an uploaded or pasted Job Description against Mayank's verified profile.
    Returns a structured fit scorecard with match score, skills, gaps, and tailored pitch.
    """
    try:
        scorecard = match_job_description(body)
        return scorecard
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze job description: {str(e)}")

