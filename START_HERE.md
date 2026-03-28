# 🚀 START HERE - Simple Setup Guide

## Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

## Step 2: Load Initial Documents

```bash
python ingest_initial_docs.py
```

This will load all 8 PDFs from `data/documents/` into ChromaDB.

## Step 3: Start Backend

```bash
python start_backend.py
```

Leave this running. You should see:
```
🚀 Starting Pillai University Knowledge Assistant Backend
📍 Server will run at: http://127.0.0.1:8000
```

## Step 4: Start Frontend

Open a NEW terminal and run:

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
  VITE v... ready in ...ms
  ➜  Local:   http://localhost:5173/
```

## Step 5: Open Browser

Go to: **http://localhost:5173**

## Step 6: Test It!

1. Ask: "What is machine learning?"
2. You should get an answer with sources like "ML_notes.pdf"
3. Try uploading a new PDF file
4. Ask a question about it!

## ✅ Success Checklist

- [ ] Backend running at http://127.0.0.1:8000
- [ ] Frontend running at http://localhost:5173
- [ ] Can see the chat interface
- [ ] Questions get answered with sources
- [ ] Can upload files via drag & drop

## ❌ Troubleshooting

### "No module named backend"

Make sure you're running from the project root directory:
```bash
cd /path/to/micro-llm-demo
python ingest_initial_docs.py
```

### "I don't know based on the provided context"

Run the ingestion script:
```bash
python ingest_initial_docs.py
```

### Backend won't start

Install dependencies:
```bash
pip install -r requirements.txt
```

### Frontend won't start

Install npm packages:
```bash
cd frontend
npm install
```

## 🎯 Quick Commands Reference

**Start Backend:**
```bash
python start_backend.py
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

**Ingest Documents:**
```bash
python ingest_initial_docs.py
```

**Test System:**
```bash
python test_system.py
```

## 📚 Need More Help?

- **QUICK_START.md** - Detailed setup guide
- **README.md** - Full documentation
- **UPLOAD_GUIDE.md** - How uploads work
- **ARCHITECTURE.md** - System architecture

---

**That's it! You're ready to go! 🎉**
