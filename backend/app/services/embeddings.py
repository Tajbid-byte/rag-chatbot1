import os
from langchain_community.embeddings import HuggingFaceEmbeddings

class EmbeddingService:
    """FREE Embeddings using HuggingFace - no API key needed!"""
    
    def __init__(self):
        print("Loading FREE HuggingFace embeddings model...")
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True}
        )
        print("Embeddings model loaded successfully!")

    def get_embeddings(self):
        return self.embeddings

    def embed_query(self, query: str) -> list:
        return self.embeddings.embed_query(query)

    def embed_documents(self, texts: list) -> list:
        return self.embeddings.embed_documents(texts)

embedding_service = EmbeddingService()
