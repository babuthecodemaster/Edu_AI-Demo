#!/usr/bin/env python3
"""
Start the FastAPI backend server.
This script ensures proper Python path setup.
"""

import sys
import os

# Add project root to Python path
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

# Now start uvicorn
import uvicorn

if __name__ == "__main__":
    print("=" * 60)
    print("Starting Pillai University Knowledge Assistant Backend")
    print("=" * 60)
    print("Server will run at: http://127.0.0.1:8000")
    print("API docs available at: http://127.0.0.1:8000/docs")
    print("=" * 60)
    print()
    
    uvicorn.run(
        "backend.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )
