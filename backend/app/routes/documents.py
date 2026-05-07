import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from app.utils.pdf_processor import PDFProcessor
from app.services.vector_store import vector_store_service
import os

router = APIRouter()
pdf_processor = PDFProcessor()

MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 10485760))

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    file_bytes = await file.read()

    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds maximum allowed size")

    try:
        doc_id = str(uuid.uuid4())
        chunks = pdf_processor.process_pdf(file_bytes, file.filename)
        chunk_count = vector_store_service.add_documents(chunks, doc_id)

        return JSONResponse(status_code=200, content={
            "success": True,
            "message": f"Successfully processed {file.filename}",
            "doc_id": doc_id,
            "filename": file.filename,
            "chunks_created": chunk_count,
            "file_size": len(file_bytes)
        })
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")

@router.get("/list")
async def list_documents():
    documents = vector_store_service.get_documents()
    return {"documents": documents, "count": len(documents)}

@router.delete("/clear")
async def clear_documents():
    vector_store_service.clear_store()
    return {"message": "All documents cleared successfully"}
