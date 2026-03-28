import chromadb
import os

# Use persistent storage
CHROMA_DB_PATH = os.path.join(os.path.dirname(__file__), "../../data/chroma_db")
os.makedirs(CHROMA_DB_PATH, exist_ok=True)

client = chromadb.PersistentClient(path=CHROMA_DB_PATH)

collection = client.get_or_create_collection(name="knowledge_base")


def add_document(text, embedding, source):

    collection.add(
        documents=[text],
        embeddings=[embedding],
        metadatas=[{"source": source}],
        ids=[str(hash(text))]
    )


def search(query_embedding):

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=3
    )

    return results