# Quick Start Guide

## The Problem You Had

Your system said "I don't know based on the provided context" because:
- PDFs existed in `data/documents/` but weren't ingested into ChromaDB
- The "Upload notes" button was just UI decoration
- ChromaDB was using in-memory storage (data lost on restart)

## What's Fixed Now

✅ **Persistent ChromaDB** - Data saved to `data/chroma_db/`
✅ **Real file upload** - POST `/upload` endpoint processes files
✅ **Automatic ingestion** - Files → chunks → embeddings → ChromaDB
✅ **Drag & drop support** - Upload files directly in the UI
✅ **Multiple file types** - PDFs, TXT, MD, CSV supported

## Setup (First Time)

### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
setup_knowledge_base.bat
```

**Linux/Mac:**
```bash
chmod +x setup_knowledge_base.sh
./setup_knowledge_base.sh
```

### Option 2: Manual Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Ingest existing PDFs
python ingest_initial_docs.py

# Start backend
cd backend
uvicorn main:app --reload

# In another terminal, start frontend
cd frontend
npm run dev
```

## Using the System

### 1. Upload Files

Three ways to upload:
- **Drag & drop** files onto the chat
- **Click paperclip** icon to browse files
- **Paste** files (if browser supports)

Supported: `.pdf`, `.txt`, `.md`, `.csv`

### 2. Ask Questions

After uploading, ask questions like:
- "What is deep learning?"
- "Explain neural networks"
- "Tell me about Pillai University"

The AI will retrieve relevant chunks from ALL uploaded documents.

### 3. See Sources

Answers include source citations showing which files were used.

## File Flow

```
Upload file.pdf
    ↓
Backend receives file
    ↓
Extract text from PDF
    ↓
Split into 500-char chunks
    ↓
Create embeddings (sentence-transformers)
    ↓
Store in ChromaDB (persistent)
    ↓
File now searchable! 🎉
```

## Verify It's Working

1. **Check backend is running**: Visit http://127.0.0.1:8000/health
   - Should show `{"status":"ok","llm_ok":true}`

2. **Check ChromaDB has data**: Look for `data/chroma_db/` folder
   - Should contain database files after ingestion

3. **Test a query**: Ask "What is machine learning?"
   - Should get an answer with sources like "ML_notes.pdf"

## Troubleshooting

### Still getting "I don't know"?

```bash
# Re-run ingestion
python ingest_initial_docs.py

# Restart backend
cd backend
uvicorn main:app --reload
```

### Upload not working?

- Check backend logs for errors
- Verify `python-multipart` is installed: `pip install python-multipart`
- Check file size (large files may timeout)

### Backend won't start?

```bash
# Install missing dependencies
pip install -r requirements.txt

# Check if port 8000 is in use
# Windows: netstat -ano | findstr :8000
# Linux/Mac: lsof -i :8000
```

## What Changed in the Code

### Backend (`backend/main.py`)
- Added `/upload` endpoint for file ingestion
- Imports `UploadFile` and `File` from FastAPI
- Calls `process_uploaded_file()` from ingestion script

### Ingestion (`scripts/ingest_docs.py`)
- New `process_uploaded_file()` function
- Supports TXT/MD/CSV in addition to PDF
- Returns chunk count for feedback

### Vector Store (`backend/retrieval/vector_store.py`)
- Changed from `chromadb.Client()` to `chromadb.PersistentClient()`
- Data now saved to `data/chroma_db/`

### Frontend (`frontend/src/pages/Index.tsx`)
- Added `UPLOAD_URL` constant
- Modified `sendQuestion()` to upload files before querying
- Files sent via FormData to `/upload` endpoint

## Next Steps

- Upload your own study materials
- Try different question types
- Check which sources are cited
- Add more documents as needed

All uploads persist forever (until you delete `data/chroma_db/`)!
