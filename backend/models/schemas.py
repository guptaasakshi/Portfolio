"""Pydantic models for request/response validation"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime


class ChatHistoryItem(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    history: Optional[List[ChatHistoryItem]] = Field(default_factory=list)

class ChatResponse(BaseModel):
    reply: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class ProjectItem(BaseModel):
    name: str
    type: str
    tech: List[str]
    live: bool = False

class SkillsData(BaseModel):
    frontend:    List[str] = Field(default_factory=list)
    backend:     List[str] = Field(default_factory=list)
    datascience: List[str] = Field(default_factory=list)
    languages:   List[str] = Field(default_factory=list)
    databases:   List[str] = Field(default_factory=list)
    tools:       List[str] = Field(default_factory=list)

class AnalyzeRequest(BaseModel):
    name:            str            = "Sakshi Gupta"
    cgpa:            float          = 8.82
    degree:          str            = "B.Tech CSE"
    college:         str            = ""
    year:            int            = 2
    projects:        List[ProjectItem] = Field(default_factory=list)
    skills:          SkillsData     = Field(default_factory=SkillsData)
    certifications:  List[str]      = Field(default_factory=list)
    github:          str            = ""
    linkedin:        str            = ""