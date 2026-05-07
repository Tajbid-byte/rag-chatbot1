import os
import tempfile
from pypdf import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter

class PDFProcessor:
    def __init__(self):
        self.chunk_size = int(os.getenv("CHUNK_SIZE", 1000))
        self.chunk_overlap = int(os.getenv("CHUNK_OVERLAP", 200))
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )

    def extract_text_from_pdf(self, file_bytes: bytes, filename: str) -> str:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            tmp_file.write(file_bytes)
            tmp_file_path = tmp_file.name

        try:
            reader = PdfReader(tmp_file_path)
            text = ""
            for page_num, page in enumerate(reader.pages):
                page_text = page.extract_text()
                if page_text:
                    text += f"\n[Page {page_num + 1}]\n{page_text}"
            return text
        finally:
            os.unlink(tmp_file_path)

    def split_text_into_chunks(self, text: str, metadata: dict = None) -> list:
        return self.text_splitter.create_documents(
            texts=[text],
            metadatas=[metadata or {}]
        )

    def process_pdf(self, file_bytes: bytes, filename: str) -> list:
        text = self.extract_text_from_pdf(file_bytes, filename)
        if not text.strip():
            raise ValueError("No text could be extracted from the PDF")
        metadata = {"filename": filename, "source": filename, "type": "pdf"}
        return self.split_text_into_chunks(text, metadata)
