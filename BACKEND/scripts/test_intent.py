import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.database import DatabaseSession, DataRepository
from app.agent.nlu_engine import NLUEngine

def test():
    session = DatabaseSession("test")
    
    queries = [
        "What are there in the mess menu today?",
        "Where is MHP?",
        "What is the attendance for CSE101?",
    ]
    
    for q in queries:
        print(f"\n--- Testing Query: {q} ---")
        res = NLUEngine.classify_and_reason(session=session, query=q, conversation_history=[], context_data={"active_subject": "CSE101"}, language="en", selected_model="8B")
        print(f"Category: {res.get('category')}")
        print(f"Topic: {res.get('topic')}")
        print(f"Content: {res.get('content')}")

if __name__ == "__main__":
    test()
