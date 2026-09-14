from typing import Dict, Any, List
from app.database import DataRepository

def search_policies_and_circulars(query: str) -> Dict[str, Any]:
    normalized_query = query.lower()
    asks_for_circulars = any(term in normalized_query for term in ("circular", "notice", "notification"))
    asks_for_policies = any(term in normalized_query for term in ("policy", "policies", "regulation", "regulations", "bylaw", "ordinance", "rule"))

    # Keep source-specific requests separate. Both repository methods provide a
    # useful default when a more specific search term has no exact match.
    policies = DataRepository.search_policies(query) if asks_for_policies or not asks_for_circulars else []
    circulars = DataRepository.search_circulars(query) if asks_for_circulars or not asks_for_policies else []
    
    citations = []
    text_lines = []

    if policies:
        text_lines.append("📜 **Approved Institutional Regulations & Policies:**")
        for p in policies:
            text_lines.append(f"\n• **{p['title']}** ({p['clause_no']}) - Effective: {p['effective_date']}")
            text_lines.append(f"  \"{p['summary']}\"")
            text_lines.append(f"  *Authority: {p['authority']}*")
            citations.append({
                "title": p["title"],
                "clause": p["clause_no"],
                "effective_date": p["effective_date"],
                "summary": p["summary"]
            })

    if circulars:
        text_lines.append("\n📢 **Official Circulars & Notices:**")
        for c in circulars:
            text_lines.append(f"\n• **{c['title']}** (Ref: {c['circular_no']}) - Issued: {c['issued_date']}")
            text_lines.append(f"  \"{c['summary']}\"")
            text_lines.append(f"  *Issued by: {c['issued_by']}*")
            citations.append({
                "title": c["title"],
                "clause": c["circular_no"],
                "effective_date": c["effective_date"],
                "summary": c["summary"]
            })

    card_data = {
        "type": "policy",
        "title": "Official Institutional Regulations & Circulars",
        "subtitle": f"{len(citations)} Official Citations Found",
        "badge": "Approved Knowledge",
        "badgeVariant": "blue",
        "data": {
            "citations": citations
        }
    }

    return {
        "text": "\n".join(text_lines),
        "citations": citations,
        "structured_card": card_data
    }
