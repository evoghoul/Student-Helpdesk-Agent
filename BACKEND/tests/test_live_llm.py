import requests
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:8000/api/v1"

# 1. Login as Asha Reddy
login_resp = requests.post(f"{BASE_URL}/auth/login", json={
    "username": "24cse001",
    "password": "student123"
})
assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
token = login_resp.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# 2. Create conversation
conv_resp = requests.post(f"{BASE_URL}/conversations", json={"title": "Conversational LLM Test"}, headers=headers)
assert conv_resp.status_code == 200, f"Conv failed: {conv_resp.text}"
conv_id = conv_resp.json()["conversation_id"]

# 3. Test a conversational query that requires deep reasoning and grounding
queries = [
    "Bro be real with me, am I cooked this semester? Give me an honest summary and motivate me.",
    "Can you explain the difference between a stack and a queue simply for my computer science exam?",
]

for q in queries:
    print("\n" + "="*70)
    print(f"STUDENT: {q}")
    print("="*70)
    msg_resp = requests.post(
        f"{BASE_URL}/conversations/{conv_id}/messages",
        json={"content": q},
        headers=headers,
        timeout=60
    )
    assert msg_resp.status_code == 200, f"Message failed: {msg_resp.text}"
    data = msg_resp.json()
    print(f"SOURCE: {data.get('source_agent')}")
    print(f"CATEGORY: {data.get('category')}")
    print(f"RESPONSE:\n{data.get('content')}")
    print("\nFOLLOW-UPS:", data.get("suggested_follow_ups"))
