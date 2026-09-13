import requests
import json
import logging
import re
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)

OLLAMA_BASE_URL = "http://localhost:11434"
DEFAULT_MODEL = "agent65-8b:latest"
FALLBACK_MODELS = ["agent65-8b:latest", "agent65-8b", "agent65:latest", "agent65", "llama3.2:3b", "llama3.1:8b"]

from app.config import settings

class LocalLLMClient:
    """
    Client for local open-source LLM inference via Ollama.
    Runs 100% offline on the user's CPU with zero external API keys.
    Supports single-turn prompts and multi-turn conversational history.
    """

    _available: Optional[bool] = None
    _active_model: Optional[str] = "agent65-8b:latest"

    @classmethod
    def is_available(cls, timeout: float = 2.0) -> bool:
        """Check if local Ollama daemon is active and running agent65-8b."""
        provider = getattr(settings, "LLM_PROVIDER", "local")
        # 1. First priority: Check local Ollama daemon
        try:
            resp = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=timeout)
            if resp.status_code == 200:
                models = resp.json().get("models", [])
                if models:
                    model_names = [m.get("name", "") for m in models]
                    for candidate in FALLBACK_MODELS:
                        for m in model_names:
                            if candidate == m or candidate.split(":")[0] == m.split(":")[0]:
                                cls._active_model = m
                                break
                        if cls._active_model:
                            break
                    if not cls._active_model and model_names:
                        cls._active_model = model_names[0]
                cls._available = True
                return True
        except Exception:
            pass

        if provider == "local":
            return cls._available is True

        # Fallback to cloud only if explicitly configured as cloud and local is down
        gemini_key = getattr(settings, "GEMINI_API_KEY", "")
        groq_key = getattr(settings, "GROQ_API_KEY", "") or getattr(settings, "CLOUD_API_KEY", "")
        if provider == "cloud" and (gemini_key or groq_key):
            return True
        return False

    @classmethod
    def get_active_model(cls) -> str:
        return cls._active_model or DEFAULT_MODEL

    @classmethod
    def generate(
        cls,
        system_prompt: str,
        user_prompt: str,
        model: Optional[str] = None,
        timeout: float = 75.0
    ) -> Optional[str]:
        """
        Generate a single-turn response from the local LLM.
        """
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        return cls._send_chat(messages, model=model, timeout=timeout)

    @classmethod
    def chat_with_history(
        cls,
        system_prompt: str,
        history: List[Dict[str, Any]],
        user_prompt: str,
        model: Optional[str] = None,
        max_history_turns: int = 4,
        timeout: float = 75.0
    ) -> Optional[str]:
        """
        Generate a multi-turn contextual response from the local LLM.
        Appends recent conversational history so the model maintains memory.
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
            if len(content) > 300:
                content = content[:300] + "..."
            if content:
                messages.append({"role": role, "content": content})

        messages.append({"role": "user", "content": user_prompt})
        return cls._send_chat(messages, model=model, timeout=timeout)

    @classmethod
    def _send_chat(
        cls,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        timeout: float = 90.0
    ) -> Optional[str]:
        provider = getattr(settings, "LLM_PROVIDER", "local")

        # 1. When provider is local, ALWAYS use the local Ollama 8B foundation model
        target_model = "agent65-8b:latest"
        if cls._active_model:
            target_model = cls._active_model

        url = f"{OLLAMA_BASE_URL}/api/chat"
        payload = {
            "model": target_model,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": 0.3,
                "top_p": 0.9,
                "num_predict": 300
            }
        }
        try:
            resp = requests.post(url, json=payload, timeout=timeout)
            if resp.status_code == 200:
                data = resp.json()
                msg = data.get("message", {}).get("content", "").strip()
                if msg:
                    logger.info(f"Successfully generated response from local 8B model ({target_model})")
                    return cls.clean_latex_formatting(msg)
        except Exception as e:
            logger.warning(f"Local Ollama 8B chat failed ({target_model}): {e}")

        # 2. Only if provider is explicitly set to 'cloud' does it fallback to external APIs
        if provider == "cloud":
            gemini_key = getattr(settings, "GEMINI_API_KEY", "")
            groq_key = getattr(settings, "GROQ_API_KEY", "") or getattr(settings, "CLOUD_API_KEY", "")
            if gemini_key:
                res = cls._send_gemini_chat(messages, timeout=timeout)
                if res:
                    return res
            if groq_key:
                res = cls._send_groq_chat(messages, timeout=timeout)
                if res:
                    return res

        return None

    @classmethod
    def _send_gemini_chat(
        cls,
        messages: List[Dict[str, str]],
        timeout: float = 75.0
    ) -> Optional[str]:
        api_key = getattr(settings, "GEMINI_API_KEY", "")
        if not api_key:
            return None
        
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={api_key}"
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
                "temperature": 0.5,
                "maxOutputTokens": 4096
            }
        }
        if system_instruction:
            payload["systemInstruction"] = system_instruction
            
        import time
        for attempt in range(5):
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
                    logger.warning(f"Gemini API returned 429, sleeping {5 * (attempt+1)}s")
                    time.sleep(5 * (attempt + 1))
                    continue
                else:
                    logger.warning(f"Gemini API returned {resp.status_code}: {resp.text}")
                    break
            except Exception as e:
                logger.warning(f"Gemini API request failed: {e}")
                
        return None

    @classmethod
    def _send_groq_chat(
        cls,
        messages: List[Dict[str, str]],
        timeout: float = 75.0
    ) -> Optional[str]:
        api_key = getattr(settings, "GROQ_API_KEY", "") or getattr(settings, "CLOUD_API_KEY", "")
        if not api_key:
            return None
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        candidate_models = ["openai/gpt-oss-20b", "qwen/qwen3.8-27b", "openai/gpt-oss-120b"]
        import time
        for candidate_model in candidate_models:
            payload = {
                "model": candidate_model,
                "messages": messages,
                "temperature": 0.5,
                "max_tokens": 4096
            }
            for attempt in range(3):
                try:
                    resp = requests.post(url, headers=headers, json=payload, timeout=timeout)
                    if resp.status_code == 200:
                        data = resp.json()
                        msg = data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
                        if msg:
                            cleaned_msg = cls.clean_latex_formatting(msg)
                            return cleaned_msg
                    elif resp.status_code == 429:
                        retry_sec = 3.5
                        try:
                            hdr = resp.headers.get("Retry-After")
                            if hdr:
                                retry_sec = max(float(hdr), 3.0)
                        except Exception:
                            retry_sec = 3.5
                        if retry_sec > 15.0:
                            logger.warning(f"Groq API model {candidate_model} rate limited for {retry_sec:.1f}s. Skipping to next model to avoid freezing.")
                            break
                        logger.warning(f"Groq API model {candidate_model} rate limited (429), waiting {retry_sec:.1f}s for attempt {attempt+1}/3...")
                        time.sleep(retry_sec)
                        continue
                    else:
                        logger.warning(f"Groq API model {candidate_model} returned {resp.status_code}: {resp.text}")
                        break
                except Exception as e:
                    logger.warning(f"Groq API model {candidate_model} request failed: {e}")
                    break
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
