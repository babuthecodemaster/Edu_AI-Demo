from fastapi import FastAPI, UploadFile, File
from backend.llm_loader import ask_llm, check_llm
from fastapi.middleware.cors import CORSMiddleware
from scripts.ingest_docs import process_uploaded_file
import tempfile
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Micro LLM API running"}


@app.get("/ask")
def ask(question: str):

    result = ask_llm(question)

    return {
        "question": question,
        "answer": result["answer"],
        "sources": result["sources"]
    }


@app.get("/health")
def health():
    """
    Basic health endpoint that also reports whether the Ollama LLM backend is reachable.
    """
    llm_ok = check_llm()
    return {
        "status": "ok",
        "llm_ok": llm_ok,
    }


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a PDF or text file and ingest it into ChromaDB.
    """
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        # Process and ingest the file
        chunks_added = process_uploaded_file(tmp_path, file.filename)
        
        # Clean up temp file
        os.unlink(tmp_path)
        
        return {
            "status": "success",
            "filename": file.filename,
            "chunks_added": chunks_added,
            "message": f"Successfully ingested {file.filename} ({chunks_added} chunks)"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }