import json
import logging
import re
from typing import Dict, Any, List, Optional, Tuple
from google import genai
from google.genai import types
from google.genai.errors import APIError
from app.config import settings

logger = logging.getLogger(__name__)

class LLMClient:
    """
    Client for cloud-based LLM inference using Google Gemini API.
    """

    @classmethod
    def is_available(cls) -> bool:
        """Check if Gemini API key is configured."""
        api_key = getattr(settings, "GEMINI_API_KEY", "")
        return bool(api_key and api_key.strip() and not api_key.startswith("YOUR_"))

    @classmethod
    def classify_intent(cls, query: str) -> str:
        """
        Classify the user query into a fixed set of intents using the LLM.
        """
        system_prompt = (
            "Classify the user's query into exactly ONE of the following intents: "
            "ATTENDANCE, EXAMS, FEES, TIMETABLE, MARKS, CURRICULUM, LIBRARY, FACULTY, KNOWLEDGE_BASE, GENERAL. "
            "Respond with ONLY the intent name in uppercase, and nothing else."
        )
        
        reply = cls._send_gemini_chat([
            {"role": "user", "content": query}
        ], system_prompt=system_prompt)
        
        if reply:
            reply = reply.strip().upper()
            valid_intents = ["ATTENDANCE", "EXAMS", "FEES", "TIMETABLE", "MARKS", "CURRICULUM", "LIBRARY", "FACULTY", "KNOWLEDGE_BASE", "GENERAL"]
            for intent in valid_intents:
                if intent in reply:
                    return intent
        return "GENERAL"

    @classmethod
    def chat_with_history(
        cls,
        system_prompt: str,
        history: List[Dict[str, Any]],
        user_prompt: str,
        model: Optional[str] = None,
        max_history_turns: int = 4,
        language: str = "en"
    ) -> Tuple[Optional[str], str, str]:
        """
        Generate a multi-turn contextual response from Gemini.
        """
        messages = []
        recent_turns = history[-max_history_turns:] if len(history) > max_history_turns else history
        
        for turn in recent_turns:
            role = "user" if turn.get("sender_role") == "STUDENT" else "model"
            content = turn.get("content", "")
            if len(content) > 800:
                content = content[:800] + "..."
            if content:
                messages.append({"role": role, "content": content})

        messages.append({"role": "user", "content": user_prompt})
        
        res = cls._send_gemini_chat(messages, system_prompt=system_prompt)
        if res:
            model_used = getattr(settings, "GEMINI_MODEL", "gemini-3.6-flash")
            return res, "cloud", model_used
            
        return None, "mock", "deterministic-fallback"

    @classmethod
    def _send_gemini_chat(
        cls,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None
    ) -> Optional[str]:
        api_key = getattr(settings, "GEMINI_API_KEY", "").strip()
        if not api_key or api_key.startswith("YOUR_"):
            return None
            
        candidate_model = getattr(settings, "GEMINI_MODEL", "gemini-3.6-flash")
        client = genai.Client(api_key=api_key)
        
        contents = []
        for msg in messages:
            role = "user" if msg["role"] == "user" else "model"
            contents.append(
                types.Content(
                    role=role,
                    parts=[types.Part.from_text(text=msg["content"])]
                )
            )
            
        config = types.GenerateContentConfig(
            temperature=0.4,
            max_output_tokens=1500,
        )
        if system_prompt:
            config.system_instruction = system_prompt
            
        import time
        for attempt in range(2):
            try:
                response = client.models.generate_content(
                    model=candidate_model,
                    contents=contents,
                    config=config
                )
                if response and response.text:
                    return cls.clean_latex_formatting(response.text)
                return None
            except APIError as e:
                if e.code == 429:
                    time.sleep(1.0)
                    continue
                else:
                    logger.warning(f"Gemini API returned error: {e}")
                    break
            except Exception as e:
                logger.warning(f"Gemini API request failed: {e}")
                break
        return None

    @staticmethod
    def clean_latex_formatting(text: str) -> str:
        """
        Strips raw LaTeX tags, math delimiters, environments, and symbols.
        """
        if not text:
            return text

        text = text.replace('\u2011', '-').replace('\u2013', '-').replace('\u2014', '--')
        text = text.replace('\u202f', ' ').replace('\xa0', ' ')
        text = text.replace('\u2018', "'").replace('\u2019', "'")
        text = text.replace('\u201c', '"').replace('\u201d', '"')

        text = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL)

        lines = text.split('\n')
        cleaned_lines = []
        for line in lines:
            if line.strip().startswith('|') and line.strip().endswith('|'):
                line = re.sub(r'</?(?:ul|ol)[^>]*>', '', line, flags=re.IGNORECASE)
                line = re.sub(r'<li>\s*', '<br>• ', line, flags=re.IGNORECASE)
                line = re.sub(r'</li>', '', line, flags=re.IGNORECASE)
                line = re.sub(r'\|\s*<br>•\s*', '| • ', line)
            else:
                line = re.sub(r'<br\s*/?>', '\n', line, flags=re.IGNORECASE)
                line = re.sub(r'</?(?:ul|ol)[^>]*>', '', line, flags=re.IGNORECASE)
                line = re.sub(r'<li>\s*', '\n• ', line, flags=re.IGNORECASE)
                line = re.sub(r'</li>', '', line, flags=re.IGNORECASE)
                line = re.sub(r'</?p[^>]*>', '\n', line, flags=re.IGNORECASE)
            cleaned_lines.append(line)
        text = '\n'.join(cleaned_lines)

        text = re.sub(r'\\begin\{[a-zA-Z*]+\}', '', text)
        text = re.sub(r'\\end\{[a-zA-Z*]+\}', '', text)
        text = re.sub(r'\\\[\s*(.*?)\s*\\\]', r'\1', text, flags=re.DOTALL)
        text = re.sub(r'\$\$\s*(.*?)\s*\$\$', r'\1', text, flags=re.DOTALL)
        text = re.sub(r'\\\(\s*(.*?)\s*\\\)', r'\1', text)
        text = re.sub(r'\\(?:left|right)\s*([()\[\]{}|<>])', r'\1', text)
        text = re.sub(r'\\(?:left|right)\.?', '', text)
        
        for _ in range(3):
            text = re.sub(r'\\(?:d|t)?frac\{([^{}]+)\}\{([^{}]+)\}', r'\1 / \2', text)
            
        text = re.sub(r'\\sqrt\{([^{}]+)\}', r'√(\1)', text)
        text = re.sub(r'\^\{?\\circ\}?', '°', text)
        text = re.sub(r'\^\{?2\}?', '²', text)
        text = re.sub(r'\^\{?3\}?', '³', text)
        
        replacements = [
            (r'\\approx\b', '≈'), (r'\\times\b', '×'), (r'\\div\b', '÷'), (r'\\cdot\b', '·'),
            (r'\\le\b', '≤'), (r'\\ge\b', '≥'), (r'\\ne\b', '≠'), (r'\\to\b', '→'),
            (r'\\infty\b', '∞'), (r'\\\\', '\n')
        ]
        for pattern, repl in replacements:
            text = re.sub(pattern, repl, text)

        text = re.sub(r'\\text\{([^{}]+)\}', r'\1', text)
        text = re.sub(r'\\mathbf\{([^{}]+)\}', r'**\1**', text)
        text = re.sub(r'\$([^$\n]+)\$', r'\1', text)
        
        text = re.sub(r'\n\s*[-*•]\s*$', '', text)
        text = re.sub(r'\n{3,}', '\n\n', text)
        return text.strip()
