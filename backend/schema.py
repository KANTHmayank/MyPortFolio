from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel, EmailStr, HttpUrl, Field


class SocialLinks(BaseModel):
    linkedin: Optional[str] = None
    github: Optional[str] = None
    leetcode: Optional[str] = None


class PersonalInfo(BaseModel):
    name: str
    title: str
    location: str
    phone: str
    email: str
    social_links: SocialLinks


class WorkExperience(BaseModel):
    company: str
    role: str
    duration: str
    location: Optional[str] = None
    highlights: List[str] = Field(default_factory=list)
    technologies: List[str] = Field(default_factory=list)


class ProjectLinks(BaseModel):
    github: Optional[str] = None
    live_demo: Optional[str] = None


class Project(BaseModel):
    name: str
    date: str
    links: ProjectLinks
    technologies: List[str] = Field(default_factory=list)
    description: str
    key_highlights: List[str] = Field(default_factory=list)


class Certification(BaseModel):
    name: str
    issuer: str
    date: str


class Education(BaseModel):
    degree: str
    institution: str
    location: str
    duration: str
    cgpa: str


class SkillSet(BaseModel):
    languages: List[str] = Field(default_factory=list)
    backend: List[str] = Field(default_factory=list)
    ai_ml: List[str] = Field(default_factory=list)
    databases: List[str] = Field(default_factory=list)
    cloud_devops: List[str] = Field(default_factory=list)
    tools_observability: List[str] = Field(default_factory=list)
    core_concepts: List[str] = Field(default_factory=list)


class CandidateProfile(BaseModel):
    personal: PersonalInfo
    summary: str
    metrics: List[str] = Field(default_factory=list)
    skills: SkillSet
    work_experience: List[WorkExperience] = Field(default_factory=list)
    projects: List[Project] = Field(default_factory=list)
    certifications: List[Certification] = Field(default_factory=list)
    education: List[Education] = Field(default_factory=list)
