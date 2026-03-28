from backend.retrieval.embedder import create_embedding
from backend.retrieval.vector_store import search


def retrieve_context(question):

    query_embedding = create_embedding(question)

    results = search(query_embedding)

    print("Retriever results:", results)

    docs = results["documents"][0]
    sources = results["metadatas"][0]

    return docs, sources