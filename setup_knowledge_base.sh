#!/bin/bash

echo "🎓 Pillai University Knowledge Base Setup"
echo "=========================================="
echo ""

# Check if Python is available
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
    echo "❌ Python not found. Please install Python 3.8+"
    exit 1
fi

PYTHON_CMD=$(command -v python3 || command -v python)

echo "📦 Installing Python dependencies..."
$PYTHON_CMD -m pip install -r requirements.txt

echo ""
echo "📚 Ingesting initial documents into ChromaDB..."
$PYTHON_CMD ingest_initial_docs.py

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the system:"
echo "   1. Backend:  python start_backend.py"
echo "   2. Frontend: cd frontend && npm install && npm run dev"
echo ""
echo "💡 You can now upload files via the UI and they'll be searchable!"
