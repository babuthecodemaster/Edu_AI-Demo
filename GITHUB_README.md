# 🎓 Edu AI Demo - Pillai University Knowledge Assistant

A powerful RAG (Retrieval-Augmented Generation) powered AI assistant for educational institutions. Upload PDFs, ask questions, and get intelligent answers with source citations!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![React](https://img.shields.io/badge/react-18+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)

## ✨ Features

- 📤 **Real-time File Upload** - Drag & drop PDFs, text files, and more
- 🔍 **Semantic Search** - AI-powered search across all documents
- 💬 **ChatGPT-style Interface** - Modern, conversational UI
- ⏹️ **Stop Button** - Cancel responses mid-generation
- 📚 **Source Citations** - See which documents were used
- 💾 **Persistent Storage** - ChromaDB vector database
- 🎨 **Beautiful UI** - Dark theme with smooth animations

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Ollama (for LLM inference)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/babuthecodemaster/Edu_AI-Demo.git
cd Edu_AI-Demo
```

2. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

3. **Ingest initial documents:**
```bash
python ingest_initial_docs.py
```

4. **Start the backend:**
```bash
python start_backend.py
```

5. **Start the frontend** (in a new terminal):
```bash
cd frontend
npm install
npm run dev
```

6. **Open your browser:**
```
http://localhost:5173
```

## 📖 Documentation

- **[START_HERE.md](START_HERE.md)** - Quick setup guide
- **[README.md](README.md)** - Full documentation
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture
- **[UPLOAD_GUIDE.md](UPLOAD_GUIDE.md)** - File upload details
- **[STOP_BUTTON_FEATURE.md](STOP_BUTTON_FEATURE.md)** - Stop button feature

## 🎯 How It Works

```
Upload PDF → Extract Text → Create Embeddings → Store in ChromaDB
                                                        ↓
User Question → Semantic Search → Retrieve Context → LLM Response
```

## 🏗️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **ChromaDB** - Vector database for embeddings
- **sentence-transformers** - Text embeddings
- **Ollama** - Local LLM inference
- **pypdf** - PDF text extraction

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **react-markdown** - Markdown rendering

## 📸 Screenshots

### Chat Interface
Beautiful, modern chat interface with file upload support.

### Stop Button
ChatGPT-style stop button to cancel responses mid-generation.

### Source Citations
See which documents were used to generate each answer.

## 🎓 Use Cases

- **Educational Institutions** - Student knowledge assistant
- **Research** - Search across multiple papers
- **Documentation** - Technical documentation search
- **Knowledge Base** - Build searchable repositories

## 🔧 API Endpoints

### POST /upload
Upload files to ingest into the knowledge base.

### GET /ask
Ask questions using RAG retrieval.

### GET /health
Check backend and LLM status.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Babu The Code Master**
- GitHub: [@babuthecodemaster](https://github.com/babuthecodemaster)

## 🙏 Acknowledgments

- Pillai University - Department of Computer Engineering
- Built with FastAPI, React, ChromaDB, and Ollama
- Powered by sentence-transformers for embeddings

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Made with ❤️ for educational institutions**

⭐ Star this repo if you find it useful!
