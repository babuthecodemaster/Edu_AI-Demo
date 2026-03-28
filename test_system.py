#!/usr/bin/env python3
"""
Quick test script to verify the RAG system is working correctly.
Run this after setup to ensure everything is configured properly.
"""

import requests
import os
import sys

BACKEND_URL = "http://127.0.0.1:8000"
CHROMA_DB_PATH = "data/chroma_db"

def test_backend_health():
    """Test if backend is running and healthy"""
    print("🔍 Testing backend health...")
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Backend is running: {data}")
            if data.get("llm_ok"):
                print("   ✅ LLM (Ollama) is connected")
            else:
                print("   ⚠️  LLM (Ollama) is not responding - answers may fail")
            return True
        else:
            print(f"   ❌ Backend returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("   ❌ Cannot connect to backend")
        print("   💡 Start backend with: cd backend && uvicorn main:app --reload")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_chromadb_exists():
    """Test if ChromaDB directory exists"""
    print("\n🔍 Testing ChromaDB storage...")
    if os.path.exists(CHROMA_DB_PATH):
        files = os.listdir(CHROMA_DB_PATH)
        if files:
            print(f"   ✅ ChromaDB directory exists with {len(files)} files")
            return True
        else:
            print("   ⚠️  ChromaDB directory exists but is empty")
            print("   💡 Run: python ingest_initial_docs.py")
            return False
    else:
        print("   ⚠️  ChromaDB directory does not exist")
        print("   💡 Run: python ingest_initial_docs.py")
        return False

def test_query():
    """Test a simple query"""
    print("\n🔍 Testing query functionality...")
    try:
        question = "What is machine learning?"
        response = requests.get(
            f"{BACKEND_URL}/ask",
            params={"question": question},
            timeout=30
        )
        if response.status_code == 200:
            data = response.json()
            answer = data.get("answer", "")
            sources = data.get("sources", [])
            
            if "don't know" in answer.lower() or "no context" in answer.lower():
                print("   ⚠️  Query returned 'I don't know' response")
                print("   💡 This means ChromaDB is empty")
                print("   💡 Run: python ingest_initial_docs.py")
                return False
            else:
                print(f"   ✅ Query successful!")
                print(f"   📝 Question: {question}")
                print(f"   💬 Answer: {answer[:100]}...")
                if sources:
                    print(f"   📚 Sources: {', '.join(sources)}")
                else:
                    print("   ⚠️  No sources returned")
                return True
        else:
            print(f"   ❌ Query failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_upload_endpoint():
    """Test if upload endpoint is accessible"""
    print("\n🔍 Testing upload endpoint...")
    try:
        # Just check if endpoint exists (will fail without file, but that's ok)
        response = requests.post(f"{BACKEND_URL}/upload", timeout=5)
        # 422 means endpoint exists but validation failed (no file provided)
        if response.status_code == 422:
            print("   ✅ Upload endpoint is accessible")
            return True
        elif response.status_code == 200:
            print("   ✅ Upload endpoint is accessible")
            return True
        else:
            print(f"   ⚠️  Upload endpoint returned unexpected status: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("   ❌ Cannot connect to backend")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def main():
    print("=" * 60)
    print("🎓 Pillai University RAG System - Test Suite")
    print("=" * 60)
    
    results = []
    
    # Test 1: Backend health
    results.append(("Backend Health", test_backend_health()))
    
    # Test 2: ChromaDB storage
    results.append(("ChromaDB Storage", test_chromadb_exists()))
    
    # Test 3: Upload endpoint
    results.append(("Upload Endpoint", test_upload_endpoint()))
    
    # Test 4: Query functionality
    results.append(("Query Functionality", test_query()))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Test Summary")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    print(f"\n{passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Your system is ready to use.")
        print("\n📝 Next steps:")
        print("   1. Open frontend: http://localhost:5173")
        print("   2. Try uploading a PDF file")
        print("   3. Ask questions about the content")
        return 0
    else:
        print("\n⚠️  Some tests failed. Please fix the issues above.")
        print("\n💡 Common fixes:")
        print("   • Backend not running: cd backend && uvicorn main:app --reload")
        print("   • ChromaDB empty: python ingest_initial_docs.py")
        print("   • Missing dependencies: pip install -r requirements.txt")
        return 1

if __name__ == "__main__":
    sys.exit(main())
