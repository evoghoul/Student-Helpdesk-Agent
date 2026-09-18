import json
from app.agent.nlu_engine import NLUEngine
from app.database import DatabaseSession

def test():
    session = DatabaseSession(student_id='cccccccc-0000-0000-0000-000000000001')
    eng = NLUEngine()
    res = eng.classify_and_reason(session, 'What is my attendance?', [], {})
    with open('test_res.json', 'w', encoding='utf-8') as f:
        json.dump(res, f, ensure_ascii=False, indent=2)

test()
