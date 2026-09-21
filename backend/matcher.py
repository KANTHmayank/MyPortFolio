import json
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

from backend.schema import CandidateProfile
from backend.agent import get_profile, get_groq_client, DEFAULT_MODEL


class JDMatchRequest(BaseModel):
    job_description: str = Field(..., min_length=20, description="Raw text of the job description")
    job_title: Optional[str] = None
    company: Optional[str] = None


class JDMatchResponse(BaseModel):
    match_score: int = Field(..., ge=0, le=100, description="Match score from 0 to 100")
    verdict: str = Field(..., description="E.g., Exceptional Match, Strong Match, Moderate Fit")
    matched_skills: List[str] = Field(default_factory=list)
    missing_or_growth_skills: List[str] = Field(default_factory=list)
    key_strengths: List[str] = Field(default_factory=list)
    recommendation: str = Field(..., description="Recommendation whether to interview the candidate")
    tailored_pitch: str = Field(..., description="2-3 sentence elevator pitch tailored to this role")


SAMPLE_JOB_DESCRIPTIONS = {
    "ai_engineer": {
        "title": "Generative AI / LLM Engineer",
        "company": "NextGen AI Labs",
        "description": """We are seeking a Generative AI Engineer to design and build production-grade agentic workflows.
Responsibilities:
- Build autonomous agent pipelines using LangGraph or LangChain.
- Implement human-in-the-loop (HITL) workflows and stateful memory checkpoints.
- Integrate fast inference LLM providers (Groq, OpenAI) into low-latency REST APIs using FastAPI.
- Implement self-healing fallbacks, prompt engineering, and RAG retrieval pipelines.
Requirements:
- Strong Python programming and asynchronous FastAPI experience.
- Hands-on experience with LangGraph, LangChain, or agentic frameworks.
- Exposure to relational databases (MySQL/PostgreSQL) and vector databases.
- Understanding of production deployment and API latency optimization."""
    },
    "backend_engineer": {
        "title": "Backend Software Engineer (Spring Boot)",
        "company": "Enterprise Cloud Systems",
        "description": """We are looking for a Backend Engineer to scale our distributed microservices.
Responsibilities:
- Develop high-throughput RESTful endpoints using Java and Spring Boot.
- Optimize complex SQL queries and database indexing across multi-million-row databases.
- Collaborate on CI/CD pipelines (Jenkins, Git) and maintain high service availability (99.9%).
- Diagnose distributed system bottlenecks using tracing tools (Splunk, Postman).
Requirements:
- 1+ years of experience with Java, Spring Boot, and RESTful architectures.
- Proven track record of query optimization and database tuning.
- Experience in microservices, distributed logging, and Agile environments."""
    },
    "fullstack_ai": {
        "title": "Full Stack AI Developer",
        "company": "Innovate AI",
        "description": """Looking for a Full Stack Developer passionate about combining modern web frontends with Generative AI backends.
Responsibilities:
- Develop interactive web applications with React, JavaScript, and modern CSS.
- Connect frontend interfaces to Python/FastAPI backends with streaming responses (SSE).
- Implement AI features such as document analysis, automated classification, and conversational copilots.
Requirements:
- Experience with Python, FastAPI, and JavaScript/React.
- Familiarity with LLM APIs (OpenAI, Groq) and prompt design.
- Passion for user experience, responsive design, and clean code."""
    }
}


def match_job_description(
    request: JDMatchRequest,
    profile: Optional[CandidateProfile] = None,
    model: Optional[str] = None
) -> JDMatchResponse:
    """Analyze job description against candidate profile and return structured evaluation."""
    if profile is None:
        profile = get_profile()

    client = get_groq_client()
    model = model or DEFAULT_MODEL

    system_prompt = f"""You are an expert Technical Recruiter and Engineering Hiring Manager evaluating a candidate for a specific job opening.

Below is the verified candidate profile:
{profile.model_dump_json(indent=2)}

TASK:
Compare the provided Job Description against Mayank Kanth's verified profile.
Analyze the requirements objectively and return ONLY a valid JSON object matching this schema:
{{
  "match_score": <integer between 0 and 100>,
  "verdict": "<Short string: 'Exceptional Match' (85-100), 'Strong Match' (70-84), 'Good Match' (55-69), or 'Moderate Fit' (<55)>",
  "matched_skills": ["<List of specific technologies and skills required by the JD that Mayank possesses>"],
  "missing_or_growth_skills": ["<List of requirements in the JD that are not explicitly listed in Mayank's profile>"],
  "key_strengths": ["<2 to 4 bullet points highlighting Mayank's relevant production achievements, metrics, or projects (e.g. PetPuja, 28% latency reduction, LangGraph HITL)>"],
  "recommendation": "<Direct, professional recommendation explaining whether and why this candidate should be interviewed>",
  "tailored_pitch": "<2-3 sentence elevator pitch connecting Mayank's unique blend of Spring Boot backend reliability and cutting-edge GenAI agent engineering to this specific role>"
}}

EVALUATION RULES:
1. Grounding: Do not claim Mayank has skills or experiences that are not in his profile.
2. If the JD requires skills Mayank does not list, include them in "missing_or_growth_skills".
3. Calculate an honest, realistic match_score reflecting both his backend (Spring Boot/Java) and AI (FastAPI/LangGraph/Groq) capabilities.
"""

    user_content = f"""JOB TITLE: {request.job_title or 'Not specified'}
COMPANY: {request.company or 'Not specified'}

JOB DESCRIPTION:
{request.job_description}
"""

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content}
        ],
        response_format={"type": "json_object"},
        max_tokens=1500,
        temperature=0.2
    )

    raw_json = response.choices[0].message.content or "{}"
    data = json.loads(raw_json)
    return JDMatchResponse(**data)
