import re
from typing import Dict, Any, List, Optional, Tuple
from app.database import DataRepository, DatabaseSession
from app.tools.attendance_tool import get_attendance_summary, calculate_consecutive_needed
from app.tools.marks_tool import get_marks_summary
from app.tools.timetable_tool import get_timetable_summary
from app.tools.exams_tool import get_exams_summary
from app.tools.fees_tool import get_fees_summary
from app.tools.curriculum_tool import get_curriculum_summary
from app.tools.knowledge_tool import search_policies_and_circulars
from app.tools.services_tool import handle_service_request, handle_human_handover
from app.agent.local_llm import LocalLLMClient

class NLUEngine:
    """
    100% Local Autonomous Cognitive NLU & Reasoning Engine.
    Zero external API keys required.
    Operates as an autonomous cognitive agent:
    - 100% of user queries are reasoned over by the fine-tuned local foundation model (agent65)
    - Dynamic RLS database grounding (attendance, timetable, exams, fees, marks, bylaws)
    - Non-destructive semantic action & UI card resolution
    - Autonomous background execution for formal service requests (Agent 46) & human escalations
    - Empathetic proactive guidance matching ChatGPT/Gemini conversational depth
    """

    @classmethod
    def classify_and_reason(
        cls,
        session: DatabaseSession,
        query: str,
        conversation_history: List[Dict[str, Any]],
        context_data: Dict[str, Any],
        language: str = "en",
        model_mode: str = "fast"
    ) -> Dict[str, Any]:
        q = query.strip()
        q_lower = q.lower()

        # Extract or retain active subject from context
        detected_subject = cls.extract_subject(q_lower)
        active_subject = detected_subject or context_data.get("active_subject")

        # ---------------- 1. INITIAL ONBOARDING DASHBOARD ----------------
        # Only if student explicitly types "menu" or "start" on an empty conversation, return the overview briefing
        if q_lower in ["start", "menu"] and len(conversation_history) == 0:
            return cls.generate_proactive_briefing(session, language)

        # ---------------- 2. DETECT BACKGROUND ACTIONS & STRUCTURED CARDS ----------------
        # In modern LLM architecture, we identify if a transactional action/card should accompany the conversational response
        card_data: Optional[Dict[str, Any]] = None
        citations: List[Dict[str, Any]] = []
        action_note = ""
        category = "LOCAL_LLM_REASONING"
        topic = "Conversational AI Assistant"
        model_label = "8B Accurate" if model_mode in ["high", "deep", "8b", "accurate"] else "3B Fast"
        source_agent = f"Agent 65 ({model_label})"

        # A. Formal Service Request (Agent 46)
        if cls.has_any_word(q_lower, ["apply for", "certificate", "bonafide", "railway concession", "transit pass", "id card", "lost card", "mentor meeting", "book mentor", "lodge grievance", "file complaint", "grievance"]):
            sr_cat = "OTHER"
            title = "General Administrative Request"
            desc = q
            if "bonafide" in q_lower:
                sr_cat = "BONAFIDE_CERTIFICATE"
                title = "Bonafide Certificate Application"
                desc = f"Student requested bonafide certificate: '{q}'"
            elif cls.has_any_word(q_lower, ["railway", "transit", "bus pass"]):
                sr_cat = "RAILWAY_CONCESSION"
                title = "Transit / Railway Concession Application"
                desc = f"Concession pass application: '{q}'"
            elif "mentor" in q_lower:
                sr_cat = "MENTOR_APPOINTMENT"
                title = "Faculty Mentor 1-on-1 Appointment"
                desc = f"Student requested mentor consultation: '{q}'"
            elif cls.has_any_word(q_lower, ["grievance", "complaint"]):
                sr_cat = "GRIEVANCE_LODGED"
                title = "Student Grievance Lodged"
                desc = f"Grievance details: '{q}'"

            sr_res = handle_service_request(session, sr_cat, title, desc)
            card_data = sr_res.get("structured_card")
            category = "SERVICE_REQUEST"
            topic = f"Service Request: {title}"
            source_agent = "Agent 65 -> Agent 46 (Workflow Automation)"
            action_note = (
                f"[SYSTEM ACTION EXECUTED: Successfully created service request ticket {sr_res['record']['request_no']} "
                f"for '{title}'. Assigned Office: {sr_res['record']['assigned_office']}, Status: {sr_res['record']['status']}, "
                f"SLA Due Date: {sr_res['record']['sla_due_date']}. Inform the student warmly of this tracking number.]"
            )

        # B. Human Escalation (Step 8)
        elif cls.has_any_word(q_lower, ["talk to human", "escalate", "human officer", "dean", "hod", "exception", "discretion"]):
            esc_res = handle_human_handover(
                session=session,
                target_office="DEAN_ACADEMICS",
                reason="Student requested administrative escalation or human evaluation.",
                summary=f"Inquiry: '{q}'. Active Subject: {active_subject or 'General'}"
            )
            card_data = esc_res.get("structured_card")
            category = "ESCALATION"
            topic = "Human Administrative Handover"
            source_agent = "Agent 65 Escalation Gateway"
            action_note = (
                f"[SYSTEM ACTION EXECUTED: Handover ticket registered with the Office of the Dean of Academics. "
                f"Reference: {card_data.get('subtitle', 'Registered')}. Assure the student that their inquiry has been routed to human officers.]"
            )

        # C. Attendance Card (Non-destructive widget attachment)
        elif cls.has_any_word(q_lower, ["attendance", "classes held", "classes attended", "attendance shortage", "bunk", "bunked", "75%"]):
            att_res = get_attendance_summary(session, active_subject)
            card_data = att_res.get("structured_card")
            if att_res.get("context_subject"):
                active_subject = att_res["context_subject"]
            citations = [
                {
                    "title": "Academic Regulations Handbook 2026",
                    "clause": "Clause 4.2: Minimum 75% Attendance Requirement",
                    "effective_date": "2026-07-01",
                    "summary": "Mandates 75% attendance to appear in End-Semester Examinations."
                }
            ]
            category = "PERSONAL_DATA"
            topic = "Attendance Analytics"
            source_agent = "Agent 11 (Attendance System)"

        # D. Exam Card
        elif cls.has_any_word(q_lower, ["exam", "exams", "cie", "cie-1", "cie-2", "cie 2", "second formative", "formative assessment", "hall ticket", "examination schedule", "exam date"]):
            exam_res = get_exams_summary(session)
            card_data = exam_res.get("structured_card")
            citations = [
                {
                    "title": "Examination Ordinance 2026",
                    "clause": "Clause 8.1: Continuous Internal Evaluation",
                    "effective_date": "2026-08-01",
                    "summary": "Two continuous internal evaluations required per semester."
                }
            ]
            category = "PERSONAL_DATA"
            topic = "Examinations & Assessments"
            source_agent = "Agent 30 & Agent 34 (Examination Hub)"

        # E. Fee Card (CRITICAL: Whole-word boundary ensures 'feeling' never triggers this)
        elif cls.has_any_word(q_lower, ["fee", "fees", "dues", "tuition", "payment", "installment", "pay fee", "balance due", "pending fees", "fee demand", "fee receipt"]):
            fee_res = get_fees_summary(session)
            card_data = fee_res.get("structured_card")
            citations = [
                {
                    "title": "Fee Payment Notification No. 104/2026",
                    "clause": "Clause 2: Late Surcharge Schedule",
                    "effective_date": "2026-08-15",
                    "summary": "Late fine of Rs. 50/day applicable after 15 Oct 2026."
                }
            ]
            category = "TRANSACTIONAL"
            topic = "Student Fee Ledgers"
            source_agent = "Agent 40 (Finance Engine)"

        # F. Timetable Card
        elif cls.has_any_word(q_lower, ["timetable", "class schedule", "schedule today", "classes today", "class today", "next class", "room no", "lecture time"]):
            tt_res = get_timetable_summary(session)
            card_data = tt_res.get("structured_card")
            category = "PERSONAL_DATA"
            topic = "Academic Timetable"
            source_agent = "Agent 10 (Scheduling Service)"

        # G. Marks & Grades Card
        elif cls.has_any_word(q_lower, ["mark", "marks", "score", "scores", "grade", "grades", "gpa", "sgpa", "cgpa", "backlog", "backlogs", "internal mark", "internal marks"]):
            marks_res = get_marks_summary(session)
            card_data = marks_res.get("structured_card")
            citations = [
                {
                    "title": "Grading System Manual 2026",
                    "clause": "Clause 3.4: 10-Point Relative Grading Scale",
                    "effective_date": "2026-07-01",
                    "summary": "Minimum passing grade of 'P' (4.0/10) required for credit award."
                }
            ]
            category = "PERSONAL_DATA"
            topic = "Academic Performance & Marks"
            source_agent = "Agent 30 (Assessment Engine)"

        # H. Curriculum & Degree Card
        elif cls.has_any_word(q_lower, ["curriculum", "credit", "credits", "graduate", "graduation", "next semester", "prerequisite", "degree audit"]):
            curr_res = get_curriculum_summary(session)
            card_data = curr_res.get("structured_card")
            citations = [
                {
                    "title": "B.Tech Curriculum Framework 2026",
                    "clause": "Section 5: Graduation Credit Requirements",
                    "effective_date": "2026-07-01",
                    "summary": "Total 120 credits required for B.Tech degree completion."
                }
            ]
            category = "ACADEMIC_AUDIT"
            topic = "Curriculum & Degree Audit"
            source_agent = "Agent 20 (Curriculum Engine)"

        # I. Official Policies & Bylaws
        elif cls.has_any_word(q_lower, ["policy", "policies", "circular", "circulars", "bylaw", "bylaws", "by-law", "regulation", "regulations", "ordinance", "condonation rule", "revaluation fee", "holiday list"]):
            pol_res = search_policies_and_circulars(q)
            card_data = pol_res.get("structured_card")
            citations = pol_res.get("citations", [])
            category = "INSTITUTIONAL_INFO"
            topic = "Official University Regulations"
            source_agent = "Agent 53 & Agent 55 (Policy Hub)"

        # J. Academic Stress & Wellness Card
        elif cls.is_stress_or_concern(q_lower):
            is_health_or_workload = cls.has_any_word(q_lower, ["headache", "sick", "pain", "unwell", "tired", "exhausted", "burnout", "assignment", "assignments", "homework", "task"])
            card_title = "Health & Assignment Wellness Support" if is_health_or_workload else "Academic Recovery & Mentorship Plan"
            profile = DataRepository.get_student_profile(session)
            name = profile.get("full_name", "Student") if profile else "Student"
            card_data = {
                "type": "ACADEMIC_ADVISING_PLAN",
                "title": card_title,
                "subtitle": f"Prepared for {name}",
                "badge": "Wellness Support" if is_health_or_workload else "Action Plan",
                "badgeVariant": "purple" if is_health_or_workload else "green",
                "data": {
                    "student_name": name,
                    "status": "Support Active",
                    "priority_action": "Rest eyes, hydrate, and take a 20-minute break" if is_health_or_workload else "Attend next classes consistently",
                    "mentor_support": "Available via Agent 46 Service Request",
                    "counselor_line": "Campus Student Wellness Center (Ext. 204 / Room 104)"
                },
                "actionLabel": "Book Mentor Meeting",
                "actionIntent": "Book mentor meeting"
            }
            category = "ACADEMIC_ADVISING"
            topic = "Student Wellness & Academic Guidance"
            source_agent = "Agent 65 Academic Advisory"
            citations = [
                {
                    "title": "Student Academic Welfare Guidelines 2026",
                    "clause": "Clause 2.1: Academic Mentorship and Condonation Discretion",
                    "effective_date": "2026-07-01",
                    "summary": "Establishes faculty mentor support and student welfare mechanisms."
                }
            ]

        # ---------------- 3. COGNITIVE LLM GENERATION (ChatGPT/Gemini Quality) ----------------
        # The fine-tuned LLM is ALWAYS the conversational voice! We NEVER replace it with a canned string.
        llm_reply = cls.generate_llm_reasoning_response(
            session=session,
            query=q,
            conversation_history=conversation_history,
            active_subject=active_subject,
            action_note=action_note,
            language=language,
            model_mode=model_mode
        )

        return {
            "category": category,
            "topic": topic,
            "source_agent": source_agent,
            "content": llm_reply,
            "citations": citations,
            "structured_card": card_data,
            "suggested_follow_ups": cls.generate_dynamic_followups(q, active_subject),
            "active_subject": active_subject
        }

    # ---------------- HELPER METHODS & LLM REASONING LOOP ----------------

    @classmethod
    def generate_llm_reasoning_response(
        cls,
        session: DatabaseSession,
        query: str,
        conversation_history: List[Dict[str, Any]],
        active_subject: Optional[str],
        action_note: str = "",
        language: str = "en",
        model_mode: str = "fast"
    ) -> str:
        """
        Generates genuine, empathetic, contextual reasoning from the local open-source LLM (agent65).
        Runs 100% offline with zero external API keys.
        """
        profile = DataRepository.get_student_profile(session)
        name = profile.get("full_name", "there") if profile else "there"
        student_first_name = name.split()[0] if name != "there" else "there"

        # If LLM is available, generate response
        if LocalLLMClient.is_available():
            grounded_context = cls.build_grounded_student_context(session)
            
            action_section = f"\nSystem Action Status:\n{action_note}\n" if action_note else ""

            INDIAN_LANG_MAP = {
                "te": ("Telugu", "తెలుగు", "Telugu"),
                "hi": ("Hindi", "हिन्दी", "Devanagari"),
                "ta": ("Tamil", "தமிழ்", "Tamil"),
                "kn": ("Kannada", "ಕನ್ನಡ", "Kannada"),
                "ml": ("Malayalam", "മലയാളം", "Malayalam"),
                "mr": ("Marathi", "मराठी", "Devanagari"),
                "bn": ("Bengali", "বাংলা", "Bengali"),
                "gu": ("Gujarati", "ગુજરાતી", "Gujarati"),
                "pa": ("Punjabi", "ਪੰਜਾਬੀ", "Gurmukhi"),
                "or": ("Odia", "ଓଡ଼ିଆ", "Odia"),
                "as": ("Assamese", "অসমীয়া", "Bengali-Assamese"),
                "ur": ("Urdu", "اردو", "Perso-Arabic"),
                "sa": ("Sanskrit", "संस्कृतम्", "Devanagari"),
                "ne": ("Nepali", "नेपाली", "Devanagari"),
                "kok": ("Konkani", "कोंकणी", "Devanagari"),
                "ks": ("Kashmiri", "کٲشُر", "Perso-Arabic"),
                "sd": ("Sindhi", "سنڌي", "Perso-Arabic"),
                "doi": ("Dogri", "डोगरी", "Devanagari"),
                "mai": ("Maithili", "मैथिली", "Devanagari"),
                "mni": ("Manipuri", "মৈতৈলোন্", "Meitei"),
                "sat": ("Santali", "ᱥᱟᱱᱛᱟᱲᱤ", "Ol Chiki"),
                "brx": ("Bodo", "बड़ो", "Devanagari"),
            }

            if language in INDIAN_LANG_MAP:
                lang_name, native_name, script_name = INDIAN_LANG_MAP[language]
                lang_directive = (
                    f"2. LANGUAGE DIRECTIVE (MANDATORY {lang_name.upper()}): The user has selected {lang_name} ({native_name}). "
                    f"You MUST respond warmly, politely, and fluently in pure {lang_name} ({native_name}) using authentic {script_name} script. "
                    f"Express all academic guidance, attendance explanations, calculations, exam info, and timetable info directly in {native_name} script. "
                    f"Even if previous turns in the chat history were in English or another language, switch completely to {lang_name} ({native_name}) now. "
                    f"Do NOT mix in Marathi, Hindi, or any other unselected Indian language. "
                    "Keep institutional identifiers like roll number '251FA04E03', room numbers, and course codes clearly readable.\n"
                )
            else:
                lang_directive = (
                    "2. LANGUAGE DIRECTIVE (STRICT ENGLISH): The user's active interface language is English. "
                    "You MUST respond EXCLUSIVELY in natural, articulate, warm conversational English using the standard Latin alphabet. "
                    "CRITICAL NEGATIVE CONSTRAINT: Even if previous messages in the conversation history were in Devanagari, Sanskrit, Marathi, Hindi, or another script, "
                    "or if the student's query contains cultural or Indian phrases (such as 'Jay Bajrangbali', 'Jay Shri Ram', 'Allah Hu Akbar', 'Namaste'), "
                    "you MUST greet or acknowledge the student warmly and provide all help, timetable details, and academic answers STRICTLY in standard English (Latin alphabet). "
                    "You are STRICTLY FORBIDDEN from generating Devanagari, Marathi, Hindi, or any regional script when the language is English.\n"
                )

            system_prompt = (
                "You are Agent 65, an exceptionally intelligent, empathetic, and knowledgeable university student helpdesk AI "
                "(comparable to ChatGPT and Google Gemini, running 100% locally with zero external API keys, grounded in official university records).\n\n"
                f"{grounded_context}\n"
                f"{action_section}\n"
                "Directives:\n"
                f"1. Address the student strictly as '{student_first_name}' (or '{name}'). NEVER invent nicknames like 'Ashu' or slang names.\n"
                f"{lang_directive}"
                "3. When discussing grades, attendance, exams, fees, or timetable, ALWAYS use the student's exact verified database records above.\n"
                "4. Maintain multi-turn conversational context across previous messages.\n"
                "5. If the student expresses physical strain, headache, fatigue, anxiety, burnout, or feeling overwhelmed from assignments/exams, "
                "be deeply empathetic and reassuring: advise resting their eyes, taking a 15-20 minute screen break, hydrating, breaking down tasks into "
                "manageable 20-minute chunks, and note that the campus health dispensary (Room 104) and faculty mentors are available. NEVER bring up unrelated fees or dues.\n"
                "6. If the student asks conceptual, technical, programming, academic, or study strategy questions, explain them clearly and comprehensively with structured Markdown, code snippets, and diagrams where appropriate.\n"
                "7. If a System Action Status is present above (such as a service request or handover ticket created), confirm it warmly with the student and provide the tracking reference.\n"
                "8. Never hallucinate fake grades or dates not present in the verified records.\n"
                "9. FORMATTING CONSTRAINT: NEVER use LaTeX tags, math blocks, backslashes, \\( \\), \\[ \\], \\approx, \\frac, or $. Express calculations, complexity, and percentages in clean natural text (e.g. use 'approx. 75%', '45 / 64 = 70.3%', 'O(1)', 'O(log n)')."
            )
            selected_model = "agent65-8b:latest" if model_mode in ["high", "deep", "8b", "accurate"] else "agent65:latest"
            llm_reply = LocalLLMClient.chat_with_history(
                system_prompt=system_prompt,
                history=conversation_history,
                user_prompt=query,
                model=selected_model
            )
            if llm_reply:
                # Script & Language Guardrail:
                # If target language is English and student's query is in Latin script (no Indic script characters),
                # ensure the LLM didn't leak Devanagari or other Indic scripts from earlier multi-turn history.
                if language == "en" and not any(0x0900 <= ord(c) <= 0x0DFF for c in query):
                    indic_count = sum(1 for c in llm_reply if 0x0900 <= ord(c) <= 0x0DFF)
                    if indic_count > 10:
                        import logging
                        logging.getLogger(__name__).warning(f"Detected script drift in LLM output ({indic_count} Indic chars) while in English mode. Regenerating in pure English.")
                        clean_history = [
                            turn for turn in conversation_history
                            if not any(0x0900 <= ord(c) <= 0x0DFF for c in turn.get("content", ""))
                        ]
                        retry_reply = LocalLLMClient.chat_with_history(
                            system_prompt=system_prompt,
                            history=clean_history,
                            user_prompt=query,
                            model=selected_model
                        )
                        if retry_reply and sum(1 for c in retry_reply if 0x0900 <= ord(c) <= 0x0DFF) <= 10:
                            return retry_reply
                return llm_reply

        # Deterministic fallback if LLM is offline or timed out
        return cls.generate_deterministic_fallback(session, query, active_subject, language)

    @classmethod
    def generate_deterministic_fallback(
        cls,
        session: DatabaseSession,
        query: str,
        active_subject: Optional[str],
        language: str = "en"
    ) -> str:
        profile = DataRepository.get_student_profile(session)
        name = profile.get("full_name", "Student") if profile else "Student"
        first_name = name.split()[0] if name else "Student"
        q_lower = query.lower()

        if language == "te":
            if cls.is_stress_or_concern(q_lower):
                return (
                    f"ఒక్క క్షణం ప్రశాంతంగా శ్వాస తీసుకోండి, {first_name}. మీ ఆరోగ్యం మరియు శ్రేయస్సు ఎల్లప్పుడూ మా మొదటి ప్రాధాన్యత.\n\n"
                    f"• **స్క్రీన్ నుండి కొద్దిసేపు దూరంగా ఉండండి**: 15–20 నిమిషాలు విశ్రాంతి తీసుకోండి, మంచి నీరు త్రాగండి మరియు మీ కళ్ళను విశ్రాంతి ఇవ్వండి.\n"
                    f"• **పనులను విభజించండి**: అన్నింటినీ ఒకేసారి కాకుండా 20 నిమిషాల వ్యవధిలో చదవండి.\n"
                    f"• **క్యాంపస్ హెల్త్ డిస్పెన్సరీ**: మీరు అసౌకర్యంగా భావిస్తే గది 104లోని విద్యార్థి హెల్త్ సెంటర్‌ను సంప్రదించండి.\n"
                    f"• **ఫ్యాకల్టీ మెంటార్**: అవసరమైతే మీ క్లాస్ టీచర్‌ను సంప్రదించి సమయం పొందవచ్చు."
                )

            if cls.has_any_word(q_lower, ["attendance", "హాజరు", "bunk", "classes held", "75%"]):
                att = DataRepository.get_attendance(session, active_subject)
                if att:
                    rec = att[0]
                    needed = calculate_consecutive_needed(rec["classes_attended"], rec["classes_held"], rec["required_pct"])
                    return (
                        f"నమస్కారం {first_name}, **{rec['course_title']}** సబ్జెక్టులో మీ లైవ్ హాజరు వివరాలు ఇక్కడ ఉన్నాయి:\n\n"
                        f"• ప్రస్తుత హాజరు శాతం: **{rec['current_pct']:.1f}%** ({rec['classes_attended']}/{rec['classes_held']} తరగతులు హాజరయ్యారు)\n"
                        f"• అవసరమైన కనీస హాజరు: **{rec['required_pct']:.0f}%**\n"
                        f"• లక్ష్యాన్ని చేరుకోవడానికి: ఎటువంటి గైర్హాజరు లేకుండా తదుపరి **{needed} తరగతులకు నిరంతరంగా** హాజరుకావాలి."
                    )

            return (
                f"నమస్కారం {first_name}, మీ అకడమిక్ సందేహాలు, హాజరు ట్రాకింగ్, పరీక్షల షెడ్యూల్ మరియు యూనివర్సిటీ సేవల విషయంలో సహాయపడటానికి నేను ఇక్కడ ఉన్నాను. ఈ రోజు నేను మీకు ఎలా సహాయపడగలను?"
            )

        if language == "hi":
            if cls.is_stress_or_concern(q_lower):
                return (
                    f"एक गहरी सांस लें, {first_name}। आपका स्वास्थ्य और भलाई हमेशा सर्वोच्च प्राथमिकता है।\n\n"
                    f"• **स्क्रीन से थोड़ी देर का विराम लें**: 15–20 मिनट का ब्रेक लें, पानी पिएं और आंखों को आराम दें।\n"
                    f"• **कार्यों को छोटे भागों में बांटें**: सब कुछ एक साथ करने के बजाय 20 मिनट के अंतराल में अध्ययन करें।\n"
                    f"• **परिसर स्वास्थ्य केंद्र**: अस्वस्थ महसूस होने पर कमरा 104 में छात्र स्वास्थ्य केंद्र जाएं।\n"
                    f"• **फैकल्टी मेंटर**: आवश्यकता पड़ने पर आप अपने मेंटर से असाइनमेंट की अंतिम तिथि बढ़ाने का अनुरोध कर सकते हैं।"
                )

            if cls.has_any_word(q_lower, ["attendance", "उपस्थिति", "bunk", "classes held", "75%"]):
                att = DataRepository.get_attendance(session, active_subject)
                if att:
                    rec = att[0]
                    needed = calculate_consecutive_needed(rec["classes_attended"], rec["classes_held"], rec["required_pct"])
                    return (
                        f"नमस्ते {first_name}, **{rec['course_title']}** विषय में आपकी वर्तमान उपस्थिति का विवरण यहाँ है:\n\n"
                        f"• वर्तमान उपस्थिति: **{rec['current_pct']:.1f}%** ({rec['classes_attended']}/{rec['classes_held']} कक्षाएं उपस्थित)\n"
                        f"• अनिवार्य सीमा: **{rec['required_pct']:.0f}%**\n"
                        f"• आवश्यक उपस्थिति: बिना अनुपस्थित रहे अगली **{needed} निरंतर कक्षाओं** में उपस्थित होना आवश्यक है।"
                    )

            return (
                f"नमस्ते {first_name}, मैं आपकी शैक्षणिक पूछताछ, उपस्थिति ट्रैकिंग, परीक्षा समय सारिणी और विश्वविद्यालय सेवाओं में सहायता के लिए यहाँ हूँ। कृपया बताएं कि मैं आपकी क्या मदद कर सकता हूँ!"
            )

        if cls.is_stress_or_concern(q_lower):
            return (
                f"Take a breath, {first_name}. Your health and wellbeing always come first.\n\n"
                f"• **Step away from your screen**: Take a 15–20 minute break, drink water, and rest your eyes.\n"
                f"• **Break tasks down**: Tackle your work in small 20-minute intervals rather than all at once.\n"
                f"• **Campus Dispensary**: If you feel unwell, visit the Campus Student Health Dispensary in Room 104.\n"
                f"• **Faculty Mentorship**: You can request an assignment extension through your faculty mentor if needed."
            )

        if cls.has_any_word(q_lower, ["attendance", "bunk", "classes held", "75%"]):
            att = DataRepository.get_attendance(session, active_subject)
            if att:
                rec = att[0]
                needed = calculate_consecutive_needed(rec["classes_attended"], rec["classes_held"], rec["required_pct"])
                return (
                    f"Hello {first_name}, here is your live attendance summary for **{rec['course_title']}**:\n\n"
                    f"• Current Attendance: **{rec['current_pct']:.1f}%** ({rec['classes_attended']}/{rec['classes_held']} classes attended)\n"
                    f"• Required Cutoff: **{rec['required_pct']:.0f}%**\n"
                    f"• Recovery Needed: **{needed} consecutive classes** without absence (Deadline: {rec['deadline']})."
                )

        return (
            f"Hello {first_name}, I am here to assist you with your academic inquiries, attendance tracking, "
            f"exam schedules, fee payments, and university services. Please let me know how I can support you!"
        )

    @staticmethod
    def has_any_word(text: str, words: List[str]) -> bool:
        """Exact word boundary matching to prevent substring false-positives (e.g. 'fee' in 'feeling')."""
        if not text:
            return False
        pattern = r'\b(?:' + '|'.join(re.escape(w) for w in words) + r')\b'
        return bool(re.search(pattern, text, re.IGNORECASE))

    @classmethod
    def extract_subject(cls, text: str) -> Optional[str]:
        if cls.has_any_word(text, ["digital logic", "dld", "digital electronics", "25cs205"]):
            return "Digital Logic design"
        if cls.has_any_word(text, ["data structures", "ds", "25cs201"]):
            return "Data Structures"
        if cls.has_any_word(text, ["discrete", "dms", "discrete mathematical", "25mt202"]):
            return "Discrete Mathematical Structures"
        if cls.has_any_word(text, ["dbms", "database", "25cs203"]):
            return "Database Management System"
        if cls.has_any_word(text, ["oops", "java", "oop", "25cs204"]):
            return "Object Oriented Programming Through Java"
        if cls.has_any_word(text, ["ai", "artificial intelligence", "24cs302"]):
            return "Artificial Intelligence"
        if cls.has_any_word(text, ["data wrangling", "dw", "visualization", "25cs202"]):
            return "Data Wrangling and Visualization"
        return None

    @staticmethod
    def is_greeting_or_open_help(q: str) -> bool:
        greetings = [
            "help", "help me", "hi", "hello", "hey", "start", "what can you do",
            "guide me", "i need help", "assist me", "good morning", "good afternoon",
            "who are you", "kya kar sakte ho", "sahayata"
        ]
        if q in greetings or len(q.split()) <= 2 and any(g in q for g in ["help", "hi", "hello", "hey"]):
            return True
        return False

    @classmethod
    def is_stress_or_concern(cls, q: str) -> bool:
        triggers = [
            "stressed", "stress", "worried", "worry", "scared", "anxious", "anxiety",
            "overwhelmed", "failing", "can i pass", "low marks", "low attendance",
            "panicking", "panic", "tension", "dar lag raha hai", "headache", "sick",
            "exhausted", "tired", "burnout", "pressure", "burden", "giving up",
            "too hard", "cant do this", "can't do this", "assignment", "assignments", "homework",
            "overloaded", "unwell", "depressed", "depression", "crying", "cant take this",
            "cooked", "am i cooked"
        ]
        return cls.has_any_word(q, triggers)

    @classmethod
    def build_grounded_student_context(cls, session: DatabaseSession) -> str:
        profile = DataRepository.get_student_profile(session)
        if not profile:
            return "Student profile: Not authenticated."

        name = profile.get("full_name", "Student")
        first_name = name.split()[0] if name else "Student"

        att = DataRepository.get_attendance(session)
        att_parts = []
        for a in att:
            pct = a.get('current_pct', 0.0)
            req = a.get('required_pct', 75.0)
            att_cnt = a.get('classes_attended', 0)
            held_cnt = a.get('classes_held', 0)
            if pct < req:
                needed = calculate_consecutive_needed(att_cnt, held_cnt, req)
                att_parts.append(
                    f"{a['course_title']}: {pct:.1f}% ({att_cnt}/{held_cnt} classes) "
                    f"[ALERT: Student needs EXACTLY {needed} consecutive classes without absence to reach {req:.0f}% cutoff]"
                )
            else:
                att_parts.append(f"{a['course_title']}: {pct:.1f}% ({att_cnt}/{held_cnt} classes) [SAFE]")
        att_summary = "; ".join(att_parts) if att_parts else "No records"

        exams = DataRepository.get_exams(session)
        exam_parts = [f"{e['course_title']} on {e.get('exam_date')} ({e.get('time_slot', 'TBD')})" for e in exams]
        exam_summary = "; ".join(exam_parts) if exam_parts else "None scheduled"

        tt = DataRepository.get_timetable(session, "Monday")
        tt_parts = [f"{t['course_title']} at {t.get('time_slot', '')} in {t.get('room_no', '')}" for t in tt]
        tt_summary = "; ".join(tt_parts) if tt_parts else "No scheduled lectures"

        academic_cal_info = (
            "OFFICIAL VFSTR ACADEMIC CALENDAR (2026-27 Sem-I, Dated 6/1/2026): "
            "Module-1 Commencement: 10-Jul-2026 (Completed); "
            "M-1 FA-1: 05-Aug & 06-Aug-2026 (Completed); "
            "Independence Day: 15-Aug-2026 (Completed Holiday); "
            "Milad-un-Nabi: 25-Aug-2026 (Completed Holiday); "
            "M-1 FA-2: 03-Sep, 05-Sep, 07-Sep-2026 (Completed); "
            "Commencement of Module-2: 08-Sep-2026 (Current term in progress); "
            "Vinayaka Chavithi Holiday: 14-Sep-2026 (Upcoming next holiday); "
            "Gandhi Jayanthi Holiday: 02-Oct-2026 (Upcoming Holiday); "
            "Module-2 FA-1 (M-2 FA-1): 06-Oct to 08-Oct-2026 (Upcoming next assessment in 24 days); "
            "Dasara Vacation (Durgashtami, Vijaya Dasami & Holidays): 18-Oct to 21-Oct-2026; "
            "Deepavali Holiday: 08-Nov-2026; "
            "Module-2 FA-2 (M-2 FA-2): 11-Nov to 13-Nov-2026; "
            "Preparation & Summative Assessment (Practical-Based): 14-Nov to 20-Nov-2026; "
            "Summative Assessment (Theory / Lecture-Based - End Semester): 21-Nov to 04-Dec-2026; "
            "Commencement of II Semester: 14-Dec-2026."
        )

        fees = DataRepository.get_fees(session)
        fee_summary = f"Total: Rs. {fees.get('total_fees', 0)}, Paid: Rs. {fees.get('paid_amount', 0)}, Pending: Rs. {fees.get('pending_amount', 0)}" if fees else "No pending fees"

        marks = DataRepository.get_marks(session)
        marks_parts = [f"{m['course_title']}: {m.get('score', 0)}/{m.get('max_score', 100)} ({m.get('assessment_type', '')})" for m in marks]
        marks_summary = "; ".join(marks_parts) if marks_parts else "No published results"

        return (
            f"Authenticated Student Verified Records (Official University DB):\n"
            f"- Student Full Name: {name} (ID: {profile.get('student_id')}). Address the student strictly as '{first_name}' or '{name}'. Never use nicknames like 'Ashu'.\n"
            f"- Program: {profile.get('degree')} in {profile.get('branch')}, Semester {profile.get('semester')}, Section {profile.get('section', 'A')}\n"
            f"- Live Attendance: {att_summary}\n"
            f"- Upcoming Examinations: {exam_summary}\n"
            f"- Today's Schedule (Monday): {tt_summary}\n"
            f"- Academic Grades / Marks: {marks_summary}\n"
            f"- Fee Accounting: {fee_summary}\n"
            f"- Official VFSTR Academic Calendar & Milestones: {academic_cal_info}\n"
            f"- Key University Regulations: Mandatory 75% attendance to appear for summative examinations (Clause 4.2). Medical condonation permitted down to 65% with Dean approval. M-2 FA-1 assessment is scheduled for 06-08 Oct 2026. Practical Summative Assessment runs from 14-20 Nov 2026, and Theory Summative Assessment (End Semesters) runs from 21 Nov to 04 Dec 2026. Revaluation fee Rs. 500/subject."
        )

    @classmethod
    def generate_dynamic_followups(cls, query: str, active_subject: Optional[str]) -> List[str]:
        q_lower = query.lower()
        if any(w in q_lower for w in ["stress", "panic", "worry", "overwhelmed", "cooked", "headache", "sick"]):
            return [
                "Book mentor meeting",
                "How to request an assignment extension?",
                "What is my attendance recovery plan?"
            ]
        if any(w in q_lower for w in ["study", "exam", "prepare", "cie"]):
            return [
                "When is my first CIE-2 exam?",
                "Show syllabus for upcoming exam",
                "What is the revaluation policy?"
            ]
        if any(w in q_lower for w in ["attendance", "class", "bunk"]):
            return [
                f"How many classes do I need in {active_subject or 'Digital Logic design'}?",
                "What is the medical condonation policy?",
                "When is my next class today?"
            ]
        return [
            f"What is my attendance in {active_subject or 'Digital Logic design'}?",
            "When is the second formative assessment?",
            "Check pending fee balance"
        ]

    @classmethod
    def generate_proactive_briefing(cls, session: DatabaseSession, language: str) -> Dict[str, Any]:
        profile = DataRepository.get_student_profile(session)
        name = profile.get("full_name", "Student") if profile else "Student"
        roll = profile.get("roll_no", "")

        att_records = DataRepository.get_attendance(session)
        low_att = [r for r in att_records if r["current_pct"] < r["required_pct"]]
        exams = DataRepository.get_exams(session)
        fees_data = DataRepository.get_fees(session)
        pending_fee = fees_data.get("outstanding_balance", 0.0) if fees_data else 0.0
        fee_due = fees_data.get("next_due_date", "") if fees_data else ""
        timetable = DataRepository.get_timetable(session)

        lines = [
            f"👋 **Hello {name}!** I am your **Agent 65 (Student Helpdesk Assistant)**.",
            f"I am securely connected to your verified student records (`{roll}`). Here is your **live academic briefing**:\n"
        ]

        if low_att:
            crit = low_att[0]
            needed = calculate_consecutive_needed(crit["classes_attended"], crit["classes_held"], crit["required_pct"])
            lines.append(
                f"⚠️ **Attendance Priority**: In **{crit['course_title']} ({crit['course_code']})**, your attendance is **{crit['current_pct']:.1f}%** ({crit['classes_attended']}/{crit['classes_held']} classes). "
                f"You need **{needed} consecutive classes** without absence to reach the mandatory 75% cutoff (Deadline: {crit['deadline']})."
            )
        else:
            lines.append("✅ **Attendance**: All your enrolled subjects are safely above the 75% requirement.")

        if exams:
            next_ex = exams[0]
            lines.append(
                f"📅 **Upcoming Assessment**: **{next_ex.get('event_name', 'Examination')}** ({next_ex.get('course_title', '')}) scheduled for **{next_ex.get('exam_date', '')}** in **{next_ex.get('room_name', 'Exam Block')}**."
            )

        if pending_fee > 0:
            due_str = f" due by {fee_due}" if fee_due else ""
            lines.append(
                f"💳 **Fee Status**: Pending balance of **₹{pending_fee:,.0f}**{due_str}."
            )

        if timetable:
            first_class = timetable[0]
            lines.append(
                f"🏫 **Next Scheduled Class**: **{first_class.get('course_title', '')}** at **{first_class.get('time_slot', '')}** in **{first_class.get('room_no', '')}**."
            )

        lines.append("\n**How can I assist you right now?** You can ask:")
        lines.append("• *'How do I recover my attendance in Digital Logic design?'*")
        lines.append("• *'Show my CIE marks and GPA'*")
        lines.append("• *'Apply for a bonafide certificate'*")
        lines.append("• *'Explain binary search trees'*")

        content = "\n".join(lines)

        structured_card = {
            "type": "PROACTIVE_BRIEFING",
            "title": f"Academic Health Snapshot: {name}",
            "subtitle": f"Student Roll: {roll}",
            "badge": "Live Briefing",
            "badgeVariant": "purple",
            "data": {
                "student_roll": roll,
                "attendance_alert": f"{low_att[0]['course_title']}: {low_att[0]['current_pct']:.1f}%" if low_att else "All Clear (>75%)",
                "next_exam": f"{exams[0].get('event_name', 'Exam')} ({exams[0].get('exam_date', '')})" if exams else "None",
                "pending_dues": f"₹{pending_fee:,.0f}",
                "next_class": f"{timetable[0].get('course_title', '')} ({timetable[0].get('time_slot', '')})" if timetable else "None"
            },
            "actionLabel": "Recover Attendance",
            "actionIntent": "How do I recover my attendance?"
        }

        return {
            "category": "PERSONAL_DATA",
            "topic": "Proactive Academic Briefing",
            "source_agent": "Agent 65 (Proactive Hub)",
            "content": content,
            "citations": [],
            "structured_card": structured_card,
            "suggested_follow_ups": [
                "How do I recover my attendance?",
                "When is the second formative assessment?",
                "Show my full marks report",
                "Apply for a bonafide certificate"
            ],
            "active_subject": low_att[0]["course_title"] if low_att else None
        }
