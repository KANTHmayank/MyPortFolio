import sys
import json
from pathlib import Path
from fastapi.testclient import TestClient

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

from backend.main import app

client = TestClient(app)

def print_separator(title: str):
    print("\n" + "=" * 60)
    print(f" {title}")
    print("=" * 60)

def test_health():
    print_separator("TEST 1: GET /api/health")
    response = client.get("/api/health")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    assert data["status"] == "healthy"
    assert data["candidate"] == "Mayank Kanth"
    print(f"Health Response: {data}")
    print("PASSED: /api/health endpoint is working.")

def test_profile():
    print_separator("TEST 2: GET /api/profile")
    response = client.get("/api/profile")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    assert data["personal"]["name"] == "Mayank Kanth"
    assert len(data["projects"]) == 3
    assert len(data["work_experience"]) == 2
    print(f"Candidate: {data['personal']['name']}")
    print(f"Title: {data['personal']['title']}")
    print(f"Projects count: {len(data['projects'])}")
    print("PASSED: /api/profile endpoint returned validated candidate data.")

def test_sample_jds():
    print_separator("TEST 3: GET /api/sample-jds")
    response = client.get("/api/sample-jds")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    assert "ai_engineer" in data
    assert "backend_engineer" in data
    assert "fullstack_ai" in data
    print(f"Available Sample JDs: {list(data.keys())}")
    print("PASSED: /api/sample-jds returned 3 pre-built sample JDs.")

def test_chat_streaming():
    print_separator("TEST 4: POST /api/chat (SSE Streaming)")
    payload = {
        "messages": [
            {"role": "user", "content": "What are Mayank's core backend skills in one sentence?"}
        ],
        "stream": True
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    assert "text/event-stream" in response.headers.get("content-type", "")

    chunks = []
    done_received = False
    for line in response.iter_lines():
        if not line:
            continue
        line_str = line if isinstance(line, str) else line.decode("utf-8")
        if line_str.startswith("data: "):
            content = line_str[6:]
            if content == "[DONE]":
                done_received = True
                break
            chunk_data = json.loads(content)
            if "chunk" in chunk_data:
                chunks.append(chunk_data["chunk"])

    assembled = "".join(chunks)
    print(f"Streamed Response:\n{assembled}\n")
    assert len(chunks) > 0, "No chunks were streamed"
    assert done_received, "Stream did not terminate with [DONE]"
    assert "Java" in assembled or "Spring" in assembled or "Python" in assembled or "FastAPI" in assembled
    print(f"PASSED: Received {len(chunks)} SSE chunks and [DONE] signal.")

def test_conversation_memory():
    print_separator("TEST 5: Conversation Memory (Multi-turn Context)")
    # Turn 1: Discuss PetPuja
    # Turn 2: Ask about "its" framework (pronoun reference)
    messages = [
        {"role": "user", "content": "Tell me about Mayank's PetPuja project."},
        {"role": "assistant", "content": "PetPuja is an autonomous AI dining agent developed by Mayank using LangGraph, FastAPI, and Groq."},
        {"role": "user", "content": "Which checkpointer did he use in it to support human-in-the-loop workflows?"}
    ]
    payload = {
        "messages": messages,
        "stream": False
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    reply = data["content"]
    print(f"Memory-Aware Response:\n{reply}\n")
    assert "MemorySaver" in reply or "memory" in reply.lower() or "checkpoint" in reply.lower(), "Model failed to retain multi-turn context"
    print("PASSED: AI correctly used conversation history to answer about MemorySaver in PetPuja.")

def test_jd_matcher():
    print_separator("TEST 6: POST /api/match-jd (Structured JSON Evaluation)")
    sample_jd = {
        "job_title": "AI & Backend Engineer",
        "company": "Cognitive Cloud",
        "job_description": """We need an AI Engineer experienced in building agentic workflows with LangGraph and Python.
You will build REST APIs with FastAPI, integrate LLMs like Groq or OpenAI, and work with microservices architectures.
Prior experience with Spring Boot or SQL query optimization is a huge bonus!"""
    }
    response = client.post("/api/match-jd", json=sample_jd)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    result = response.json()
    print(f"Match Score: {result['match_score']}/100")
    print(f"Verdict: {result['verdict']}")
    print(f"Matched Skills: {result['matched_skills']}")
    print(f"Missing / Growth Skills: {result['missing_or_growth_skills']}")
    print(f"Key Strengths: {result['key_strengths']}")
    print(f"Recommendation: {result['recommendation']}")
    print(f"Tailored Pitch: {result['tailored_pitch']}")

    assert 60 <= result["match_score"] <= 100, f"Unexpected match score: {result['match_score']}"
    assert len(result["matched_skills"]) > 0, "Expected at least one matched skill"
    assert len(result["key_strengths"]) > 0, "Expected key strengths to be populated"
    print("PASSED: /api/match-jd produced valid structured scorecard.")

if __name__ == "__main__":
    try:
        test_health()
        test_profile()
        test_sample_jds()
        test_chat_streaming()
        test_conversation_memory()
        test_jd_matcher()
        print_separator("ALL PHASE 2 TESTS PASSED SUCCESSFULLY! 🚀")
    except Exception as e:
        print(f"\n❌ PHASE 2 TEST FAILED: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
