from typing import Dict, Any, Optional
from app.database import DataRepository, DatabaseSession

def handle_service_request(
    session: DatabaseSession,
    category: str,
    title: str,
    description: str,
    priority: str = "NORMAL"
) -> Dict[str, Any]:
    record = DataRepository.create_service_request(session, {
        "category": category,
        "title": title,
        "description": description,
        "priority": priority
    })

    text = (
        f"✅ **Service Request Created Successfully**\n\n"
        f"• Request Tracking No: **{record['request_no']}**\n"
        f"• Category: **{record['category'].replace('_', ' ').title()}**\n"
        f"• Title: {record['title']}\n"
        f"• Assigned Office: **{record['assigned_office']}**\n"
        f"• Status: **{record['status']}**\n"
        f"• Estimated SLA Resolution: **{record['sla_due_date']}**\n\n"
        f"You can track the progress of this request in your Services tab or quote reference `{record['request_no']}` at the Registrar desk."
    )

    card_data = {
        "type": "service",
        "title": record["title"],
        "subtitle": f"Tracking ID: {record['request_no']}",
        "badge": record["status"],
        "badgeVariant": "green",
        "data": record,
        "actionLabel": "View Request Details",
        "actionIntent": f"service:{record['request_no']}"
    }

    return {
        "text": text,
        "record": record,
        "structured_card": card_data
    }

def handle_human_handover(
    session: DatabaseSession,
    target_office: str,
    reason: str,
    summary: str,
    urgency: str = "NORMAL"
) -> Dict[str, Any]:
    handover_no = f"HO-2026-{uuid_snip()}"
    text = (
        f"🤝 **Handover to Human Administrative Office Created**\n\n"
        f"Your query requires discretionary evaluation or human administrative review.\n"
        f"• Handover Reference: **{handover_no}**\n"
        f"• Target Office: **{target_office.replace('_', ' ').title()}**\n"
        f"• Reason: {reason}\n"
        f"• Urgency: **{urgency}**\n\n"
        f"The relevant academic officer has been notified with the context of your inquiry. You will receive an update in your notification feed."
    )

    card_data = {
        "type": "service",
        "title": f"Escalated to {target_office.replace('_', ' ').title()}",
        "subtitle": f"Reference: {handover_no}",
        "badge": f"{urgency} Escalation",
        "badgeVariant": "purple",
        "data": {
            "handoverNo": handover_no,
            "targetOffice": target_office,
            "reason": reason,
            "summary": summary
        }
    }

    return {
        "text": text,
        "handover_no": handover_no,
        "structured_card": card_data
    }

def uuid_snip() -> str:
    import uuid
    return uuid.uuid4().hex[:6].upper()
