import os
from langchain_groq import ChatGroq
from langchain.schema import HumanMessage, SystemMessage, AIMessage
from app.services.vector_store import vector_store_service

class LLMService:
    """Using FREE Groq API - Super fast Llama 3.1 70B model"""
    
    def __init__(self):
        self.llm = ChatGroq(
            groq_api_key=os.getenv("GROQ_API_KEY"),
            model_name="llama-3.1-70b-versatile",
            temperature=0.7,
            max_tokens=1000
        )
        self.chat_histories = {}
        print("Groq LLM initialized with Llama 3.1 70B (FREE)")

    def _get_system_prompt(self) -> str:
        return """You are an intelligent document assistant powered by AI. Your role is to:
1. Answer questions based on the provided document context
2. Be accurate and cite relevant information from the documents
3. If the answer is not in the documents, clearly state that
4. Be concise but comprehensive in your responses
5. Use bullet points or numbered lists when appropriate for clarity
6. Format your responses using markdown when helpful

Always base your answers on the provided context. If you cannot find
relevant information in the context, say "I could not find information
about this in the uploaded documents."
"""

    def generate_response(self, query: str, session_id: str, use_context: bool = True) -> dict:
        context_docs = []
        sources = []

        if use_context and vector_store_service.vector_store is not None:
            results = vector_store_service.similarity_search(query, k=4)
            for doc, score in results:
                if score < 1.5:
                    context_docs.append(doc.page_content)
                    sources.append({
                        "filename": doc.metadata.get("filename", "Unknown"),
                        "page": doc.metadata.get("page", "N/A"),
                        "score": round(float(score), 3)
                    })

        context = "\n\n---\n\n".join(context_docs) if context_docs else "No relevant context found in documents."

        if session_id not in self.chat_histories:
            self.chat_histories[session_id] = []

        history = self.chat_histories[session_id]
        messages = [SystemMessage(content=self._get_system_prompt())]

        # Add previous conversation history
        for h in history[-6:]:
            messages.append(HumanMessage(content=h["human"]))
            messages.append(AIMessage(content=h["ai"]))

        # Add current question with context
        user_message = f"""Context from documents:
{context}

User Question: {query}

Please provide a helpful answer based on the context above."""

        messages.append(HumanMessage(content=user_message))

        # Get response from Groq
        response = self.llm.invoke(messages)
        ai_response = response.content

        # Save to history
        history.append({"human": query, "ai": ai_response})
        if len(history) > 10:
            self.chat_histories[session_id] = history[-10:]

        return {
            "answer": ai_response,
            "sources": sources,
            "has_context": len(context_docs) > 0
        }

    def clear_history(self, session_id: str):
        if session_id in self.chat_histories:
            del self.chat_histories[session_id]

llm_service = LLMService()
