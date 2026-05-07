import os
from langchain_community.vectorstores import FAISS
from app.services.embeddings import embedding_service

class VectorStoreService:
    def __init__(self):
        self.vector_store = None
        self.document_registry = {}

    def add_documents(self, documents: list, doc_id: str):
        if self.vector_store is None:
            self.vector_store = FAISS.from_documents(
                documents,
                embedding_service.get_embeddings()
            )
        else:
            new_store = FAISS.from_documents(
                documents,
                embedding_service.get_embeddings()
            )
            self.vector_store.merge_from(new_store)

        self.document_registry[doc_id] = {
            "chunk_count": len(documents),
            "filename": documents[0].metadata.get("filename", "unknown")
        }
        return len(documents)

    def similarity_search(self, query: str, k: int = 4) -> list:
        if self.vector_store is None:
            return []
        return self.vector_store.similarity_search_with_score(query, k=k)

    def get_documents(self) -> dict:
        return self.document_registry

    def clear_store(self):
        self.vector_store = None
        self.document_registry = {}

vector_store_service = VectorStoreService()
