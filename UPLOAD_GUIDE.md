# File Upload & Knowledge Base Guide

## Overview

Your RAG system now supports **real-time file uploads** that actually affect answers! Files are ingested into ChromaDB and become searchable immediately.

## How It Works

1. **Upload files** via the UI (drag & drop or click paperclip icon)
2. Files are sent to `/upload` endpoint
3. Backend extracts text, chunks it, creates embeddings
4. Chunks are stored in **persistent ChromaDB** at `data/chroma_db/`
5. Future queries retrieve from ALL ingested documents

## Initial Setup

### 1. Ingest Existing PDFs

Run this once to load the PDFs already in `data/documents/`:

```bash
python ingest_initial_docs.py
```

This will process all 8 PDFs (AI_notes, ML_notes, etc.) and add them to ChromaDB.

### 2. Start the Backend

```bash
cd backend
uvicorn main:app --reload
```

### 3. Start the Frontend

```bash
cd frontend
npm run dev
```

## Using File Upload

### Supported File Types
- **PDFs** (.pdf)
- **Text files** (.txt, .md, .csv)

### Upload Methods

1. **Drag & Drop**: Drag files directly onto the chat interface
2. **Click to Upload**: Click the paperclip icon and select files
3. **Multiple Files**: Upload multiple files at once

### What Happens When You Upload

```
User uploads "new_notes.pdf"
    ↓
Frontend sends to /upload endpoint
    ↓
Backend extracts text from PDF
    ↓
Text is chunked (500 chars each)
    ↓
Each chunk is embedded using sentence-transformers
    ↓
Chunks stored in ChromaDB with metadata
    ↓
File is now searchable in future queries!
```

## Persistent Storage

- ChromaDB data is stored in `data/chroma_db/`
- Data persists across server restarts
- No need to re-ingest files after restarting

## API Endpoints

### POST /upload
Upload a file to ingest into the knowledge base.

**Request**: multipart/form-data with file
**Response**:
```json
{
  "status": "success",
  "filename": "my_notes.pdf",
  "chunks_added": 42,
  "message": "Successfully ingested my_notes.pdf (42 chunks)"
}
```

### GET /ask?question=...
Ask a question using RAG retrieval.

**Response**:
```json
{
  "question": "What is deep learning?",
  "answer": "Deep learning is...",
  "sources": ["ML_notes.pdf", "AI_notes.pdf"]
}
```

## Troubleshooting

### "I don't know based on the provided context"

This means:
1. No documents have been ingested yet → Run `python ingest_initial_docs.py`
2. Your question doesn't match any document content
3. ChromaDB is empty → Check `data/chroma_db/` exists

### Files not affecting answers

1. Check backend logs for upload errors
2. Verify ChromaDB path is writable
3. Restart backend to reload vector store

### Backend offline

Make sure FastAPI is running:
```bash
cd backend
uvicorn main:app --reload
```

## Architecture

```
Frontend (React + TypeScript)
    ↓ HTTP POST /upload
Backend (FastAPI)
    ↓ process_uploaded_file()
Ingestion Script
    ↓ create_embedding()
Embedder (sentence-transformers)
    ↓ add_document()
Vector Store (ChromaDB - Persistent)
```

## Next Steps

- Upload your own study materials
- Ask questions and see sources cited
- Files are automatically chunked and embedded
- All uploads persist across restarts
