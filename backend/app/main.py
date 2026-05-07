from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from app.routes import chat, documents

app = FastAPI(
    title="RAG Chatbot API - Powered by Groq",
    description="AI Document Search with FREE Groq + HuggingFace",
    version="1.0.0"
)

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])

@app.get("/")
async def root():
    return {
        "message": "RAG Chatbot API is running",
        "status": "healthy",
        "ai_provider": "Groq (FREE)",
        "embeddings": "HuggingFace (FREE)"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
