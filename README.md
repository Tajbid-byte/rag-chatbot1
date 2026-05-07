# RAG Chatbot - 100% FREE AI Document Search

Chat with PDFs using FREE AI - powered by Groq Llama 3.1 70B and HuggingFace embeddings.

## Tech Stack
- Frontend: React + Tailwind + Vite
- Backend: FastAPI + Python
- AI: Groq FREE Llama 3.1 70B
- Embeddings: HuggingFace FREE
- Vector DB: FAISS
- Deploy: Vercel + Render

## Get FREE Groq API Key
1. Go to https://console.groq.com
2. Sign up no credit card needed
3. Create API key
4. Add to .env file

## Local Setup

### Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000

### Frontend
cd frontend
npm install
cp .env.example .env.local
npm run dev

Visit http://localhost:5173

## Cost: $0 forever
