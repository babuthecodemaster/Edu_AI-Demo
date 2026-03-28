import requests
from backend.retrieval.retriever import retrieve_context

OLLAMA_URL = "http://localhost:11434/api/generate"


def ask_llm(question):
    docs, sources = retrieve_context(question)

    context = "\n".join(docs)

    # Enhanced instructions for detailed, ChatGPT-style responses
    enhanced_instructions = (
        "You are a knowledgeable AI assistant for Pillai University students. "
        "Provide detailed, comprehensive, and well-structured answers.\n\n"
        "INSTRUCTIONS:\n"
        "1) Use the provided Context to answer the question thoroughly\n"
        "2) Explain concepts clearly with examples when relevant\n"
        "3) Structure your answer with proper paragraphs and formatting\n"
        "4) If the Context lacks information, say: 'I don't know based on the provided context.'\n"
        "5) Be conversational and educational, like explaining to a fellow student\n"
        "6) Include relevant details, definitions, and explanations from the Context\n"
        "7) If there are multiple aspects to the question, address them all\n\n"
    )

    if not context.strip():
        return {
            "answer": "I don't know based on the provided context.",
            "sources": [],
        }

    prompt = f"""{enhanced_instructions}

Context (retrieved from course materials):
{context}

Student Question:
{question}

Detailed Answer:
"""

    payload = {
        "model": "phi3",
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.3,
            "top_p": 0.9,
            "max_tokens": 1000
        },
    }

    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=60)
        response.raise_for_status()
        data = response.json()
        answer = data.get("response", "").strip() or "LLM did not return a response."
    except Exception as e:
        answer = f"Error contacting LLM backend: {e}"
        sources = []

    return {
        "answer": answer,
        "sources": [s["source"] for s in sources],
    }


def check_llm() -> bool:
    """
    Lightweight health check for the Ollama server.
    Tries to hit the /api/tags endpoint with a short timeout.
    """
    try:
        tags_url = OLLAMA_URL.replace("/api/generate", "/api/tags")
        resp = requests.get(tags_url, timeout=5)
        return resp.ok
    except Exception:
        return False