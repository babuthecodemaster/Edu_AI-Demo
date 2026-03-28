#!/usr/bin/env python3
"""
Quick script to ingest all PDFs from data/documents into ChromaDB.
Run this once to populate your knowledge base.
"""

import sys
import os

# Add the project root to the path so we can import backend modules
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

# Now we can import
from scripts.ingest_docs import ingest

if __name__ == "__main__":
    print("🚀 Starting document ingestion...")
    print("📂 Processing PDFs from data/documents/")
    print("-" * 50)
    
    try:
        ingest()
        print("-" * 50)
        print("✅ All documents ingested into ChromaDB!")
        print("💡 Your knowledge base is now ready to answer questions.")
    except Exception as e:
        print(f"\n❌ Error during ingestion: {e}")
        print("\n💡 Make sure you're running this from the project root directory")
        print("💡 And that all dependencies are installed: pip install -r requirements.txt")
        sys.exit(1)
