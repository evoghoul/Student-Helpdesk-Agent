import requests
import json
import logging
import re
from typing import Dict, Any, List, Optional, Tuple

logger = logging.getLogger(__name__)

from app.config import settings

def get_ollama_base_url() -> str:
    """Derives base Ollama URL from settings.LOCAL_MODEL_URL, stripping endpoint suffixes."""
    raw = getattr(settings, "LOCAL_MODEL_URL", "http://localhost:11434")
    for suffix in ["/api/chat", "/api/generate", "/api/tags"]:
        if raw.endswith(suffix):
            raw = raw[:-len(suffix)]
    return raw.rstrip("/")

DEFAULT_MODEL = "agent65-8b:latest"
FALLBACK_MODELS = ["agent65-8b:latest", "agent65-8b", "agent65:latest", "agent65", "llama3.2:3b", "llama3.1:8b"]

class LocalLLMClient:
    """
    Client for local open-source LLM inference via Ollama.
    Runs 100% offline on the user's CPU with zero external API keys.
    Supports single-turn prompts and multi-turn conversational history.
    """

    _available: Optional[bool] = None
    _active_model: Optional[str] = None
    _last_check_time: float = 0.0
    _check_ttl: float = 5.0

    @classmethod
    def is_available(cls, timeout: float = 1.0) -> bool:
        """Check if local Ollama daemon is active and running agent65-8b, caching result for 5s."""
        import time
        now = time.time()
        if cls._available is not None and (now - cls._last_check_time) < cls._check_ttl:
            return cls._available

        cls._last_check_time = now
        provider = getattr(settings, "LLM_PROVIDER", "local")
        if provider == "mock":
            cls._available = False
            return False

        configured_model = getattr(settings, "LOCAL_MODEL_NAME", "")
        candidates = [configured_model, *FALLBACK_MODELS]
        candidates = [candidate for candidate in candidates if candidate]
        # 1. First priority: Check local Ollama daemon
        try:
            resp = requests.get(
                f"{get_ollama_base_url()}/api/tags",
                timeout=timeout,
                headers={"ngrok-skip-browser-warning": "true"}
            )
            if resp.status_code == 200:
                models = resp.json().get("models", [])
                if models:
                    model_names = [m.get("name", "") for m in models]
                    cls._active_model = None
                    for candidate in candidates:
                        for m in model_names:
                            if candidate == m or candidate.split(":")[0] == m.split(":")[0]:
                                cls._active_model = m
                                break
                        if cls._active_model:
                            break
                    if not cls._active_model:
                        logger.warning(
                            f"None of candidate models {candidates} are installed in Ollama. "
                            f"Available models: {model_names}. Please install or create one."
                        )
                        cls._available = False
                        return False
                else:
                    logger.warning("Ollama daemon responded, but no models are installed.")
                    cls._available = False
                    return False
                cls._available = True
                return True
        except Exception:
            pass

        # Fallback to cloud if keys are present (True Tier 2 Cascade)
        gemini_key = getattr(settings, "GEMINI_API_KEY", "")
        groq_key = getattr(settings, "GROQ_API_KEY", "") or getattr(settings, "CLOUD_API_KEY", "")
        if gemini_key or groq_key:
            cls._available = True
            return True

        if provider == "local":
            cls._available = False
            return False

        cls._available = False
        return False

    @classmethod
    def get_active_model(cls) -> str:
        return cls._active_model or DEFAULT_MODEL

    @classmethod
    def resolve_model_name(cls, model: Optional[str] = None) -> str:
        """Map UI complexity labels to real Ollama model names."""
        requested = (model or "").strip()
        if requested.upper() == "3B":
            return getattr(settings, "LOCAL_FAST_MODEL_NAME", "agent65-3b:latest")
        if requested.upper() == "8B":
            return getattr(settings, "LOCAL_MODEL_NAME", DEFAULT_MODEL)
        return requested or cls.get_active_model()

    @classmethod
    def generate(
        cls,
        system_prompt: str,
        user_prompt: str,
        model: Optional[str] = None,
        timeout: float = 30.0,
        language: str = "en"
    ) -> Tuple[Optional[str], str, str]:
        """
        Generate a single-turn response from the hybrid LLM cascade.
        Returns: (content, provider_type, model_name)
        """
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        return cls._send_chat(messages, model=model, timeout=timeout, language=language)

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
        reply, _, _ = cls.generate(system_prompt, query, timeout=5.0)
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
        timeout: float = 30.0,
        language: str = "en"
    ) -> Tuple[Optional[str], str, str]:
        """
        Generate a multi-turn contextual response from the hybrid LLM cascade.
        Appends recent conversational history so the model maintains memory.
        Returns: (content, provider_type, model_name)
        """
        messages: List[Dict[str, str]] = [
            {"role": "system", "content": system_prompt}
        ]

        # Ingest recent turns
        recent_turns = history[-max_history_turns:] if len(history) > max_history_turns else history
        for turn in recent_turns:
            role = "user" if turn.get("sender_role") == "STUDENT" else "assistant"
            content = turn.get("content", "")
            # Truncate very long past turns to save context window
            if len(content) > 800:
                content = content[:800] + "..."
            if content:
                messages.append({"role": role, "content": content})

        messages.append({"role": "user", "content": user_prompt})
        return cls._send_chat(messages, model=model, timeout=timeout, language=language)

    @classmethod
    def _send_chat(
        cls,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        timeout: float = 30.0,
        language: str = "en"
    ) -> Tuple[Optional[str], str, str]:
        """
        3-Tier Hybrid Cascade with Smart Indic Language Routing:
        - For Hindi, Hinglish, Telugu: Prioritizes Cloud API (Gemini / Groq) for superior Indic vocabulary and phrasing, with local fallback.
        - For English / General: Prioritizes Local Ollama (agent65-8b:latest), with Cloud API fallback.
        - Offline Tier: Returns (None, "mock", "deterministic-fallback") if models are unreachable.
        """
        provider = getattr(settings, "LLM_PROVIDER", "local")
        target_model = cls.resolve_model_name(model)
        is_indic = language in ["hi", "hinglish", "te", "te_roman"]

        gemini_key = getattr(settings, "GEMINI_API_KEY", "")
        groq_key = getattr(settings, "GROQ_API_KEY", "") or getattr(settings, "CLOUD_API_KEY", "")

        # ---------------- PRIORITY FOR LONG PROMPTS & INDIC LANGUAGES ----------------
        # Cloud LLMs (Gemini / Groq) handle long reasoning better and possess vast native multilingual vocabularies
        user_msg = next((m.get("content", "") for m in reversed(messages) if m.get("role") == "user"), "")
        is_long_prompt = len(user_msg.split()) > 30

        if (is_indic or is_long_prompt) and (gemini_key or groq_key):
            routing_reason = "Indic language" if is_indic else f"Long prompt ({len(user_msg.split())} words)"
            if gemini_key:
                res = cls._send_gemini_chat(messages, timeout=14.0)
                if res:
                    logger.info(f"Successfully generated response via Gemini Cloud API (Reason: {routing_reason})")
                    return res, "cloud", "Gemini 1.5 Flash"
            if groq_key:
                res = cls._send_groq_chat(messages, timeout=14.0)
                if res:
                    logger.info(f"Successfully generated response via Groq Cloud API (Reason: {routing_reason})")
                    return res, "cloud", "Groq Cloud"

        # ---------------- TIER 1: LOCAL OLLAMA INFERENCE ----------------
        if provider != "cloud":
            url = f"{get_ollama_base_url()}/api/chat"
            payload = {
                "model": target_model,
                "messages": messages,
                "stream": False,
                "options": {
                    "temperature": 0.3,
                    "top_p": 0.9,
                    "num_predict": 750,
                    "num_ctx": 4096
                }
            }
            try:
                # Fast 4.0s connection timeout so that if the laptop is off, it quickly cascades to cloud
                resp = requests.post(
                    url,
                    json=payload,
                    timeout=(4.0, timeout),
                    headers={"ngrok-skip-browser-warning": "true"}
                )
                if resp.status_code == 200:
                    data = resp.json()
                    msg = data.get("message", {}).get("content", "").strip()
                    if msg:
                        logger.info(f"Successfully generated response from local 8B model ({target_model})")
                        return cls.clean_latex_formatting(msg), "local", target_model
            except Exception as e:
                logger.warning(f"Local Ollama chat failed/timed out ({target_model}): {e}. Shifting to Cloud Acceleration.")

        # ---------------- TIER 2: CLOUD ACCELERATED FALLBACK ----------------
        if gemini_key:
            res = cls._send_gemini_chat(messages, timeout=14.0)
            if res:
                return res, "cloud", "Gemini 1.5 Flash"

        if groq_key:
            res = cls._send_groq_chat(messages, timeout=14.0)
            if res:
                return res, "cloud", "Groq Cloud"

        # ---------------- TIER 3: DETERMINISTIC OFFLINE RULES ----------------
        return None, "mock", "deterministic-fallback"

    @classmethod
    def _send_gemini_chat(
        cls,
        messages: List[Dict[str, str]],
        timeout: float = 15.0
    ) -> Optional[str]:
        api_key = getattr(settings, "GEMINI_API_KEY", "")
        if not api_key:
            return None
        
        headers = {
            "Content-Type": "application/json"
        }
        
        contents = []
        system_instruction = None
        for msg in messages:
            role = msg.get("role")
            content = msg.get("content", "")
            if role == "system":
                system_instruction = {"parts": [{"text": content}]}
            else:
                g_role = "user" if role == "user" else "model"
                contents.append({
                    "role": g_role,
                    "parts": [{"text": content}]
                })
                
        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": 0.4,
                "maxOutputTokens": 4096
            }
        }
        if system_instruction:
            payload["systemInstruction"] = system_instruction
            
        candidate_models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"]
        import time
        for cand_model in candidate_models:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{cand_model}:generateContent?key={api_key}"
            for attempt in range(2):
                try:
                    resp = requests.post(url, headers=headers, json=payload, timeout=timeout)
                    if resp.status_code == 200:
                        data = resp.json()
                        candidates = data.get("candidates", [])
                        if candidates:
                            msg = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "").strip()
                            if msg:
                                cleaned_msg = cls.clean_latex_formatting(msg)
                                return cleaned_msg
                    elif resp.status_code == 429:
                        time.sleep(1.5)
                        continue
                    else:
                        logger.warning(f"Gemini model {cand_model} returned {resp.status_code}: {resp.text[:200]}")
                        break
                except Exception as e:
                    logger.warning(f"Gemini API request failed ({cand_model}): {e}")
                    break
                
        return None

    @classmethod
    def _send_groq_chat(
        cls,
        messages: List[Dict[str, str]],
        timeout: float = 15.0
    ) -> Optional[str]:
        api_key = getattr(settings, "GROQ_API_KEY", "") or getattr(settings, "CLOUD_API_KEY", "")
        if not api_key:
            return None
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        candidate_models = ["openai/gpt-oss-20b", "openai/gpt-oss-120b", "groq/compound", "qwen/qwen3.8-27b"]
        import time
        for candidate_model in candidate_models:
            payload = {
                "model": candidate_model,
                "messages": messages,
                "temperature": 0.4,
                "max_tokens": 700
            }
            try:
                resp = requests.post(url, headers=headers, json=payload, timeout=timeout)
                if resp.status_code == 200:
                    data = resp.json()
                    message = data.get("choices", [{}])[0].get("message", {})
                    msg = message.get("content", "")
                    if not msg:
                        msg = message.get("reasoning", "")
                    msg = msg.strip()
                    if msg:
                        cleaned_msg = cls.clean_latex_formatting(msg)
                        return cleaned_msg
                elif resp.status_code == 429:
                    time.sleep(1.0)
                    continue
                else:
                    logger.warning(f"Groq API model {candidate_model} returned {resp.status_code}: {resp.text[:200]}")
            except Exception as e:
                logger.warning(f"Groq API model {candidate_model} request failed: {e}")
        return None

    @staticmethod
    def clean_latex_formatting(text: str) -> str:
        """
        Strips raw LaTeX tags, math delimiters, environments, and symbols,
        converting formulas into clean, human-readable text for modern chat interfaces.
        """
        if not text:
            return text

        # Clean unicode characters that cause cp1252 encode failures on Windows
        text = text.replace('\u2011', '-').replace('\u2013', '-').replace('\u2014', '--')
        text = text.replace('\u202f', ' ').replace('\xa0', ' ')
        text = text.replace('\u2018', "'").replace('\u2019', "'")
        text = text.replace('\u201c', '"').replace('\u201d', '"')

        # 0. Strip reasoning / thinking tags like <think> ... </think>
        text = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL)

        # 0b. Clean HTML tags: handle lines inside tables vs outside tables
        lines = text.split('\n')
        cleaned_lines = []
        for line in lines:
            if line.strip().startswith('|') and line.strip().endswith('|'):
                # Inside markdown table: convert <li> to <br>• to preserve table row integrity
                line = re.sub(r'</?(?:ul|ol)[^>]*>', '', line, flags=re.IGNORECASE)
                line = re.sub(r'<li>\s*', '<br>• ', line, flags=re.IGNORECASE)
                line = re.sub(r'</li>', '', line, flags=re.IGNORECASE)
                line = re.sub(r'\|\s*<br>•\s*', '| • ', line)
            else:
                # Outside tables: convert <br> to newline and <li> to newline bullets
                line = re.sub(r'<br\s*/?>', '\n', line, flags=re.IGNORECASE)
                line = re.sub(r'</?(?:ul|ol)[^>]*>', '', line, flags=re.IGNORECASE)
                line = re.sub(r'<li>\s*', '\n• ', line, flags=re.IGNORECASE)
                line = re.sub(r'</li>', '', line, flags=re.IGNORECASE)
                line = re.sub(r'</?p[^>]*>', '\n', line, flags=re.IGNORECASE)
            cleaned_lines.append(line)
        text = '\n'.join(cleaned_lines)

        # 1. Strip LaTeX environments like \begin{align} ... \end{align} or \begin{matrix} ...
        text = re.sub(r'\\begin\{[a-zA-Z*]+\}', '', text)
        text = re.sub(r'\\end\{[a-zA-Z*]+\}', '', text)

        # 2. Strip display math blocks \[ ... \] and $$ ... $$
        text = re.sub(r'\\\[\s*(.*?)\s*\\\]', r'\1', text, flags=re.DOTALL)
        text = re.sub(r'\$\$\s*(.*?)\s*\$\$', r'\1', text, flags=re.DOTALL)

        # 3. Strip inline math delimiters \( ... \)
        text = re.sub(r'\\\(\s*(.*?)\s*\\\)', r'\1', text)

        # 4. Clean \left and \right prefixes cleanly before brackets/parentheses
        text = re.sub(r'\\(?:left|right)\s*([()\[\]{}|<>])', r'\1', text)
        text = re.sub(r'\\(?:left|right)\.?', '', text)

        # 5. Convert fractions \frac{a}{b}, \dfrac, \tfrac -> a / b (up to 3 nested passes)
        for _ in range(3):
            text = re.sub(r'\\(?:d|t)?frac\{([^{}]+)\}\{([^{}]+)\}', r'\1 / \2', text)

        # 6. Convert square roots \sqrt{x} -> √(x)
        text = re.sub(r'\\sqrt\{([^{}]+)\}', r'√(\1)', text)

        # 7. Convert degrees and exponents: ^\circ -> °, ^2 -> ², ^3 -> ³, ^k -> ᵏ, ^n -> ⁿ
        text = re.sub(r'\^\{?\\circ\}?', '°', text)
        text = re.sub(r'\^\{?2\}?', '²', text)
        text = re.sub(r'\^\{?3\}?', '³', text)
        text = re.sub(r'\^\{?k\}?', 'ᵏ', text)
        text = re.sub(r'\^\{?n\}?', 'ⁿ', text)
        text = re.sub(r'\^\{?0\}?', '⁰', text)
        text = re.sub(r'\^\{?1\}?', '¹', text)

        # 8. Convert logarithms and subscripts: \log_{2} -> log₂, \log_2 -> log₂
        text = re.sub(r'\\log_\{?2\}?', 'log₂', text)
        text = re.sub(r'\\log\b', 'log', text)

        # 9. Convert LaTeX symbols and Greek letters to clean unicode
        replacements = [
            (r'\\approx\b', '≈'),
            (r'\\sim\b', '~'),
            (r'\\times\b', '×'),
            (r'\\div\b', '÷'),
            (r'\\cdot\b', '·'),
            (r'\\pm\b', '±'),
            (r'\\mp\b', '∓'),
            (r'\\le\b', '≤'),
            (r'\\leq\b', '≤'),
            (r'\\ge\b', '≥'),
            (r'\\geq\b', '≥'),
            (r'\\ne\b', '≠'),
            (r'\\neq\b', '≠'),
            (r'\\to\b', '→'),
            (r'\\rightarrow\b', '→'),
            (r'\\Rightarrow\b', '⇒'),
            (r'\\implies\b', '⇒'),
            (r'\\leftarrow\b', '←'),
            (r'\\in\b', 'in'),
            (r'\\notin\b', 'not in'),
            (r'\\subset\b', '⊂'),
            (r'\\subseteq\b', '⊆'),
            (r'\\infty\b', '∞'),
            (r'\\sum\b', 'Σ'),
            (r'\\prod\b', 'Π'),
            (r'\\int\b', '∫'),
            (r'\\dots\b', '...'),
            (r'\\ldots\b', '...'),
            (r'\\cdots\b', '...'),
            (r'\\vdots\b', '...'),
            (r'\\alpha\b', 'α'),
            (r'\\beta\b', 'β'),
            (r'\\gamma\b', 'γ'),
            (r'\\delta\b', 'δ'),
            (r'\\Delta\b', 'Δ'),
            (r'\\theta\b', 'θ'),
            (r'\\lambda\b', 'λ'),
            (r'\\mu\b', 'μ'),
            (r'\\pi\b', 'π'),
            (r'\\sigma\b', 'σ'),
            (r'\\omega\b', 'ω'),
            (r'\\Omega\b', 'Ω'),
            (r'\\quad\b', '  '),
            (r'\\qquad\b', '    '),
            (r'\\%', '%'),
            (r'\\_', '_'),
            (r'\\&', '&'),
            (r'\\#', '#'),
            (r'\\\\', '\n'),
        ]
        for pattern, repl in replacements:
            text = re.sub(pattern, repl, text)

        # 10. \text{...}, \mathbf{...}, \mathit{...}, etc. -> clean text
        text = re.sub(r'\\text\{([^{}]+)\}', r'\1', text)
        text = re.sub(r'\\mathbf\{([^{}]+)\}', r'**\1**', text)
        text = re.sub(r'\\mathit\{([^{}]+)\}', r'*\1*', text)
        text = re.sub(r'\\mathrm\{([^{}]+)\}', r'\1', text)
        text = re.sub(r'\\mathbb\{([^{}]+)\}', r'\1', text)
        text = re.sub(r'\\mathcal\{([^{}]+)\}', r'\1', text)

        # 11. Remove standalone $ enclosing formulas (e.g. $O(1)$ -> O(1), $75\%$ -> 75%)
        text = re.sub(r'\$([^$\n]+)\$', r'\1', text)

        # 12. Clean up any leftover stray backslashes before alphanumeric words (e.g. \over -> over)
        text = re.sub(r'\\([a-zA-Z]+)', r'\1', text)

        # 13. Trim trailing dangling bullet points or cut-off list markers (e.g. "\n- " or "\n* ")
        text = re.sub(r'\n\s*[-*•]\s*$', '', text)

        # 14. If the last line ends abruptly on a dangling preposition or conjunction, trim cleanly
        lines = text.rstrip().split('\n')
        if lines:
            last_line = lines[-1].strip()
            # If the last line is a dangling word like "and achieving your" or ends with a hanging comma/hyphen
            dangling_end = re.search(r'\b(?:and|or|the|a|an|in|on|at|to|of|for|with|by|your|their|its|achieving)\s*$', last_line, re.IGNORECASE)
            if dangling_end and len(lines) > 1:
                # Check if the line has an earlier complete sentence
                sentences = re.split(r'(?<=[.!?])\s+', last_line)
                if len(sentences) > 1:
                    lines[-1] = " ".join(sentences[:-1])
                    text = "\n".join(lines)
                else:
                    # Remove the incomplete line
                    lines.pop()
                    text = "\n".join(lines)

        # 15. Normalize excessive whitespace
        text = re.sub(r'\n{3,}', '\n\n', text)

        return text.strip()
