# 🎓 Pillai University - Micro-LLM Knowledge Assistant

A RAG (Retrieval-Augmented Generation) powered knowledge assistant for Pillai University students. Upload PDFs, ask questions, and get answers with source citations!

## ✨ Features

- 📤 **Real-time File Upload** - Drag & drop PDFs, text files, and more
- 🔍 **Semantic Search** - Find relevant information across all documents
- 💬 **Conversational AI** - Natural language Q&A interface
- 📚 **Source Citations** - See which documents were used for each answer
- 💾 **Persistent Storage** - Uploaded files remain searchable forever
- 🎨 **Modern UI** - Beautiful, responsive chat interface

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Ollama (for LLM inference)

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

1. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

2. **Ingest existing PDFs:**
```bash
python ingest_initial_docs.py
```

3. **Start the backend:**
```bash
cd backend
uvicorn main:app --reload
```

4. **Start the frontend** (in a new terminal):
```bash
cd frontend
npm install
npm run dev
```

5. **Open your browser:**
```
http://localhost:5173
```

### Verify Installation

Run the test suite to ensure everything is working:
```bash
python test_system.py
```

## 📖 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get up and running fast
- **[UPLOAD_GUIDE.md](UPLOAD_GUIDE.md)** - How file uploads work
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture details
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Technical implementation
- **[CHECKLIST.md](CHECKLIST.md)** - Implementation checklist

## 🎯 How It Works

```
1. Upload a PDF → 2. Text extracted → 3. Split into chunks
                                              ↓
6. Get answer ← 5. LLM generates ← 4. Stored in ChromaDB
   with sources    response with       (vector embeddings)
                   retrieved context
```

### Example Usage

1. **Upload your study materials** (PDFs, notes, etc.)
2. **Ask a question**: "What is deep learning?"
3. **Get an answer** with sources cited
4. **Files persist** - no need to re-upload

## 🏗️ Architecture

```
Frontend (React + TypeScript)
    ↓ HTTP
Backend (FastAPI)
    ↓
Ingestion Pipeline
    ↓
ChromaDB (Vector Store)
    ↓
Ollama (LLM)
```

## 📁 Project Structure

```
.
├── backend/                 # FastAPI backend
│   ├── main.py             # API endpoints
│   ├── llm_loader.py       # Ollama integration
│   └── retrieval/          # RAG components
│       ├── embedder.py     # Text embeddings
│       ├── retriever.py    # Context retrieval
│       └── vector_store.py # ChromaDB interface
│
├── frontend/               # React frontend
│   └── src/
│       └── pages/
│           └── Index.tsx   # Main chat UI
│
├── scripts/
│   └── ingest_docs.py     # Document ingestion
│
├── data/
│   ├── documents/         # Source PDFs
│   └── chroma_db/         # Vector database
│
└── Documentation files...
```

## 🔧 API Endpoints

### POST /upload
Upload a file to ingest into the knowledge base.

**Request:** multipart/form-data
```bash
curl -X POST http://127.0.0.1:8000/upload \
  -F "file=@notes.pdf"
```

**Response:**
```json
{
  "status": "success",
  "filename": "notes.pdf",
  "chunks_added": 42,
  "message": "Successfully ingested notes.pdf (42 chunks)"
}
```

### GET /ask
Ask a question using RAG retrieval.

**Request:**
```bash
curl "http://127.0.0.1:8000/ask?question=What%20is%20ML"
```

**Response:**
```json
{
  "question": "What is ML",
  "answer": "Machine learning is...",
  "sources": ["ML_notes.pdf"]
}
```

### GET /health
Check backend and LLM status.

**Response:**
```json
{
  "status": "ok",
  "llm_ok": true
}
```

## 🐛 Troubleshooting

### "I don't know based on the provided context"

**Cause:** ChromaDB is empty (no documents ingested)

**Fix:**
```bash
python ingest_initial_docs.py
```

### Backend won't start

**Cause:** Missing dependencies

**Fix:**
```bash
pip install -r requirements.txt
```

### Upload fails with 422 error

**Cause:** Missing `python-multipart`

**Fix:**
```bash
pip install python-multipart
```

### Can't read PDFs

**Cause:** Missing `pypdf`

**Fix:**
```bash
pip install pypdf
```

### Data lost after restart

**Cause:** Using in-memory ChromaDB (should be fixed now)

**Verify:** Check that `data/chroma_db/` exists and has files

### Frontend can't connect

**Cause:** Backend not running

**Fix:**
```bash
cd backend
uvicorn main:app --reload
```

## 🔒 Security Notes

Current implementation is for development/educational use. For production:

- [ ] Add authentication
- [ ] Restrict CORS origins
- [ ] Add file size limits
- [ ] Validate MIME types
- [ ] Add rate limiting
- [ ] Sanitize user inputs

## 📦 Dependencies

### Backend
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `chromadb` - Vector database
- `sentence-transformers` - Embeddings
- `python-multipart` - File uploads
- `pypdf` - PDF text extraction
- `requests` - HTTP client

### Frontend
- `react` - UI framework
- `typescript` - Type safety
- `vite` - Build tool
- `tailwindcss` - Styling
- `shadcn/ui` - Components
- `react-markdown` - Markdown rendering

## 🎓 Use Cases

- **Study Assistant** - Upload lecture notes, ask questions
- **Research Helper** - Search across multiple papers
- **Documentation Search** - Find information in technical docs
- **Knowledge Base** - Build a searchable knowledge repository

## 🚧 Future Enhancements

- [ ] Multi-user support with authentication
- [ ] File management (list, delete uploaded files)
- [ ] Advanced search filters
- [ ] Export conversations
- [ ] Mobile app
- [ ] OCR for scanned PDFs
- [ ] Support for more file types (DOCX, PPTX)
- [ ] Conversation history persistence
- [ ] Semantic chunking strategies

## 📝 License

This project is for educational purposes at Pillai University.

## 🤝 Contributing

This is a student project. Contributions and improvements are welcome!

## 📧 Support

For issues or questions:
1. Check the documentation files
2. Run `python test_system.py` to diagnose issues
3. Check backend logs for errors

## 🎉 Acknowledgments

- Pillai University - Department of Computer Engineering
- Built with FastAPI, React, ChromaDB, and Ollama
- Powered by sentence-transformers for embeddings

---

**Made with ❤️ for Pillai University students**

🚀 **Ready to start?** Run `setup_knowledge_base.bat` (Windows) or `./setup_knowledge_base.sh` (Linux/Mac)
