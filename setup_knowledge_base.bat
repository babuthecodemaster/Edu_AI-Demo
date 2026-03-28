@echo off
echo 🎓 Pillai University Knowledge Base Setup
echo ==========================================
echo.

echo 📦 Installing Python dependencies...
python -m pip install -r requirements.txt

echo.
echo 📚 Ingesting initial documents into ChromaDB...
python ingest_initial_docs.py

echo.
echo ✅ Setup complete!
echo.
echo 🚀 To start the system:
echo    1. Backend:  python start_backend.py
echo    2. Frontend: cd frontend ^&^& npm install ^&^& npm run dev
echo.
echo 💡 You can now upload files via the UI and they'll be searchable!
pause
