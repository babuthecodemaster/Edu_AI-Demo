import os
from pypdf import PdfReader

from backend.retrieval.embedder import create_embedding
from backend.retrieval.vector_store import add_document

DOCS_PATH = "data/documents"


def read_pdf(path):
    reader = PdfReader(path)
    text = ""

    for page in reader.pages:
        if page.extract_text():
            text += page.extract_text()

    return text


def read_text_file(path):
    """Read plain text files"""
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()


def chunk_text(text, chunk_size=500):
    chunks = []

    for i in range(0, len(text), chunk_size):
        chunks.append(text[i:i + chunk_size])

    return chunks


def process_uploaded_file(file_path, filename):
    """
    Process a single uploaded file and add it to ChromaDB.
    Returns the number of chunks added.
    """
    print(f"Processing uploaded file: {filename}")
    
    # Determine file type and read content
    if filename.lower().endswith('.pdf'):
        text = read_pdf(file_path)
    elif filename.lower().endswith(('.txt', '.md', '.csv')):
        text = read_text_file(file_path)
    else:
        raise ValueError(f"Unsupported file type: {filename}")
    
    if not text.strip():
        raise ValueError(f"No text content found in {filename}")
    
    # Chunk and embed
    chunks = chunk_text(text)
    
    for chunk in chunks:
        embedding = create_embedding(chunk)
        add_document(chunk, embedding, filename)
    
    print(f"Added {len(chunks)} chunks from {filename}")
    return len(chunks)


def ingest():

    for file in os.listdir(DOCS_PATH):

        if not file.endswith(".pdf"):
            continue

        path = os.path.join(DOCS_PATH, file)

        print(f"Processing {file}")

        text = read_pdf(path)

        chunks = chunk_text(text)

        for chunk in chunks:

            embedding = create_embedding(chunk)

            add_document(chunk, embedding, file)

    print("Ingestion complete!")


if __name__ == "__main__":
    ingest()