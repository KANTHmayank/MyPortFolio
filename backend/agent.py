import os
import json
from pathlib import Path
from typing import Generator, List, Dict, Any, Optional
from dotenv import load_dotenv
from groq import Groq

from backend.schema import CandidateProfile
from backend.prompt import build_system_prompt

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
PROFILE_PATH = BASE_DIR / "data" / "profile.json"

_cached_profile: Optional[CandidateProfile] = None
_cached_client: Optional[Groq] = None

DEFAULT_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")


def get_profile() -> CandidateProfile:
    """Load and validate the candidate profile from disk."""
    global _cached_profile
    if _cached_profile is None:
        if not PROFILE_PATH.exists():
            raise FileNotFoundError(f"Profile not found at {PROFILE_PATH}")
        with open(PROFILE_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        _cached_profile = CandidateProfile(**data)
    return _cached_profile


def get_groq_client() -> Groq:
    """Initialize and return the Groq client."""
    global _cached_client
    if _cached_client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY environment variable is missing.")
        _cached_client = Groq(api_key=api_key)
    return _cached_client


def prepare_messages(
    messages: List[Dict[str, str]], 
    profile: Optional[CandidateProfile] = None,
    language: str = "en"
) -> List[Dict[str, str]]:
    """Inject the hardened system prompt at the beginning of the message history."""
    if profile is None:
        profile = get_profile()

    system_prompt = build_system_prompt(profile, language=language)
    full_messages = [{"role": "system", "content": system_prompt}]

    # Filter and append conversation messages (ignoring any existing system messages from client)
    for msg in messages:
        if msg.get("role") in ["user", "assistant"]:
            full_messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })

    return full_messages


def ask_candidate(
    messages: List[Dict[str, str]],
    model: Optional[str] = None,
    max_tokens: int = 1500,
    language: str = "en"
) -> str:
    """Generate a non-streaming completion using Groq."""
    client = get_groq_client()
    model = model or DEFAULT_MODEL
    full_messages = prepare_messages(messages, language=language)

    response = client.chat.completions.create(
        model=model,
        messages=full_messages,
        max_tokens=max_tokens,
        temperature=0.4
    )

    msg = response.choices[0].message
    content = msg.content or ""
    return content


def stream_candidate(
    messages: List[Dict[str, str]],
    model: Optional[str] = None,
    max_tokens: int = 1500,
    language: str = "en"
) -> Generator[str, None, None]:
    """Stream token chunks from Groq."""
    client = get_groq_client()
    model = model or DEFAULT_MODEL
    full_messages = prepare_messages(messages, language=language)

    stream = client.chat.completions.create(
        model=model,
        messages=full_messages,
        stream=True,
        max_tokens=max_tokens,
        temperature=0.4
    )

    for chunk in stream:
        delta = chunk.choices[0].delta
        if hasattr(delta, "content") and delta.content:
            yield delta.content
