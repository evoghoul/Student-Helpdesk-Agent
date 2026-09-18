import sys
import os

# Add the BACKEND folder to sys.path so we can import from app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.agent.local_llm import LocalLLMClient

def test():
    query = "What are there in the mess menu today?"
    
    prompt = f"""You are a query classifier. Classify the user query into exactly ONE of the following intents:
- ATTENDANCE
- MARKS
- FEES
- LIBRARY
- TIMETABLE
- EXAMS
- CURRICULUM
- SERVICES
- CAMPUS_INFO
- GENERAL

User Query: "{query}"

Output ONLY the intent string."""

    print("Calling LLM...")
    res, provider, model = LocalLLMClient._send_chat([{"role": "user", "content": prompt}], model="8b")
    print(f"Result: {res}")
    print(f"Provider: {provider}")

if __name__ == "__main__":
    test()
