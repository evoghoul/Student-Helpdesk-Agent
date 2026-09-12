import datetime
from typing import Dict, Any, Optional
from app.database import DataRepository, DatabaseSession

def get_timetable_summary(session: DatabaseSession, day: Optional[str] = None) -> Dict[str, Any]:
    target_day = day
    if not target_day:
        weekday_name = datetime.date.today().strftime('%A')
        today_slots = DataRepository.get_timetable(session, weekday_name)
        if today_slots:
            target_day = weekday_name
        else:
            target_day = 'Friday'

    slots = DataRepository.get_timetable(session, target_day)
    
    if not slots:
        slots = DataRepository.get_timetable(session)

    if not slots:
        return {
            'text': f'You have no scheduled lectures or laboratories on {target_day}. Section-7 (N-312) timetable is active.',
            'structured_card': None
        }

    text_lines = [
        f'Here is your official schedule for Section-7 (N-312) on **{target_day}**:\n',
        'Class Teacher: **Mr. T. Latesh Babu** | Coordinator: **Mr. Uttej Kumar Nannapaneni (9573793802)**\n'
    ]
    for s in slots:
        time_slot = s.get('time_slot', '')
        title = s.get('course_title', '')
        code = s.get('course_code', '')
        room = s.get('room_no', '')
        fac = s.get('faculty_name', '')
        text_lines.append(
            f'• **{time_slot}**: **{title} ({code})**\n'
            f'  Location: **{room}** | Faculty: {fac}'
        )

    card_data = {
        'type': 'timetable',
        'title': f'Academic Schedule ({target_day}) — Section-7 (N-312)',
        'subtitle': f'{len(slots)} Sessions Scheduled',
        'badge': 'Section 7 Active',
        'badgeVariant': 'blue',
        'data': {
            'day': target_day,
            'room': 'N-312 (Section 7)',
            'class_teacher': 'Mr. T. Latesh Babu',
            'coordinator': 'Mr. Uttej Kumar Nannapaneni (9573793802)',
            'slots': slots
        },
        'actionLabel': 'View Full Weekly Routine',
        'actionIntent': 'view:timetable'
    }

    return {
        'text': '\n'.join(text_lines),
        'structured_card': card_data
    }
