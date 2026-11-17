"""
Base Agent Infrastructure for Specialist Research Agents
Strict Integrity Enforcement:
- If GEMINI_API_KEY is not configured, status is DISCONNECTED / NOT_EXECUTED.
- Never falsely report simulated heuristic outputs as real Gemini reasoning.
- When GEMINI_API_KEY is present, makes genuine API requests to the configured Gemini model.
- Robust JSON response extraction handling markdown code fences.
- Full error tracking with secrets redacted.
"""

import os
import json
import logging
import datetime
from typing import Dict, Any, List, Optional
import httpx
from ..config import settings

logger = logging.getLogger("sabzaar.agents")

def extract_json_from_llm_text(text: str) -> Dict[str, Any]:
    """Safely extracts a JSON object from raw LLM output, stripping markdown fences."""
    text = text.strip()
    if text.startswith("```"):
        import re
        m = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
        if m:
            text = m.group(1).strip()
    return json.loads(text)

class BaseSpecialistAgent:
    def __init__(
        self,
        agent_id: str,
        name: str,
        role: str,
        system_prompt: str,
        responsibilities: List[str]
    ):
        self.agent_id = agent_id
        self.name = name
        self.role = role
        self.system_prompt = system_prompt
        self.responsibilities = responsibilities
        self.status = "NOT_EXECUTED"
        self.last_report: Optional[Dict[str, Any]] = None

    async def execute(
        self,
        context: Dict[str, Any],
        peer_critiques: Optional[List[Dict[str, Any]]] = None,
        api_key: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes the agent's scientific research task.
        STRICT INTEGRITY: Only runs if Gemini API is connected.
        Does NOT fake AI execution when disconnected.
        """
        active_key = (api_key or os.getenv("GEMINI_API_KEY") or settings.GEMINI_API_KEY or "").strip()
        now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
        
        if not active_key:
            self.status = "NOT_EXECUTED"
            report_data = {
                "agent_id": self.agent_id,
                "agent_name": self.name,
                "status": "NOT_EXECUTED",
                "gemini_connected": False,
                "execution_mode": "DISCONNECTED",
                "message": "Gemini API is DISCONNECTED. Provide GEMINI_API_KEY in .env or via dashboard to execute real multi-agent LLM reasoning.",
                "findings": [],
                "recommendations": [],
                "disagreements_with_peers": [],
                "scientific_evidence_citations": [],
                "confidence_score": 0.0,
                "timestamp_utc": now_iso,
                "verdict_summary": "Agent has NOT executed. Awaiting active Gemini API connection."
            }
            self.last_report = report_data
            return report_data
            
        self.status = "RUNNING"
        try:
            report_data = await self._call_gemini_api(active_key, context, peer_critiques)
            if report_data and report_data.get("status") == "COMPLETED":
                self.status = "COMPLETED"
                self.last_report = report_data
                return report_data
            else:
                self.status = "FAILED"
                self.last_report = report_data
                return report_data
                
        except Exception as e:
            self.status = "FAILED"
            logger.error(f"Error executing agent {self.agent_id}: {str(e)}", exc_info=True)
            error_report = {
                "agent_id": self.agent_id,
                "agent_name": self.name,
                "status": "FAILED",
                "gemini_connected": True,
                "execution_mode": "FAILED",
                "error_message": str(e),
                "timestamp_utc": now_iso,
                "findings": [],
                "recommendations": [],
                "disagreements_with_peers": [],
                "confidence_score": 0.0,
                "verdict_summary": f"Agent execution failed with error: {str(e)}"
            }
            self.last_report = error_report
            return error_report

    async def _call_gemini_api(
        self,
        api_key: str,
        context: Dict[str, Any],
        peer_critiques: Optional[List[Dict[str, Any]]]
    ) -> Dict[str, Any]:
        """
        Invokes genuine Google Gemini API with structured prompt and JSON response schema.
        Never leaks the API key in logs or output.
        """
        model = os.getenv("GEMINI_MODEL") or settings.GEMINI_MODEL or "gemini-4-argon"
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
        
        prompt_payload = {
            "role": self.role,
            "responsibilities": self.responsibilities,
            "target_location": context.get("target_location", "Islamabad, Pakistan"),
            "context": context,
            "peer_critiques_received": peer_critiques or []
        }
        
        request_body = {
            "contents": [{
                "parts": [{
                    "text": (
                        f"System Directive: You are an autonomous specialist agent in the Sabzaar Living Walls Research Laboratory.\n"
                        f"Your Role: {self.role}\n"
                        f"Target Location: {context.get('target_location', 'Islamabad, Pakistan')}\n"
                        f"Instructions: {self.system_prompt}\n\n"
                        f"Task Input Data:\n{json.dumps(prompt_payload, indent=2)}\n\n"
                        "You MUST respond ONLY with a valid JSON object matching this exact schema (no prose outside JSON):\n"
                        "{\n"
                        f'  "agent_id": "{self.agent_id}",\n'
                        f'  "agent_name": "{self.name}",\n'
                        '  "findings": ["concrete finding 1", "concrete finding 2"],\n'
                        '  "recommendations": [{"action": "KEEP|ADD|REMOVE|REPLACE|ADJUST", "target": "ingredient or process", "details": "scientific rationale"}],\n'
                        '  "disagreements_with_peers": ["scientific challenge or critique of other agents"],\n'
                        '  "scientific_evidence_citations": ["DOI, standard or patent citation"],\n'
                        '  "confidence_score": 0.85,\n'
                        '  "verdict_summary": "detailed scientific conclusion paragraph"\n'
                        "}"
                    )
                }]
            }],
            "generationConfig": {
                "responseMimeType": "application/json",
                "temperature": 0.25
            }
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(url, json=request_body)
            
            if resp.status_code == 200:
                data = resp.json()
                candidate_text = data["candidates"][0]["content"]["parts"][0]["text"]
                parsed = extract_json_from_llm_text(candidate_text)
                parsed["agent_id"] = self.agent_id
                parsed["agent_name"] = self.name
                parsed["status"] = "COMPLETED"
                parsed["gemini_connected"] = True
                parsed["execution_mode"] = "GEMINI_API"
                parsed["model"] = model
                parsed["timestamp_utc"] = now_iso
                return parsed
            else:
                err_msg = f"Gemini API returned HTTP {resp.status_code}: {resp.text[:300]}"
                logger.error(f"Gemini API call failed for {self.agent_id}: {err_msg}")
                return {
                    "agent_id": self.agent_id,
                    "agent_name": self.name,
                    "status": "FAILED",
                    "gemini_connected": True,
                    "execution_mode": "FAILED",
                    "error_message": err_msg,
                    "timestamp_utc": now_iso,
                    "findings": [],
                    "recommendations": [],
                    "disagreements_with_peers": [],
                    "confidence_score": 0.0,
                    "verdict_summary": f"Gemini API request failed (HTTP {resp.status_code})."
                }

    def get_domain_reference(self) -> Dict[str, Any]:
        """Provides static domain reference documentation, clearly marked as REFERENCE ONLY."""
        return {
            "agent_id": self.agent_id,
            "agent_name": self.name,
            "role": self.role,
            "responsibilities": self.responsibilities,
            "status": self.status,
            "is_reference_baseline": True,
            "note": "Static domain reference guide. Not a live LLM execution."
        }
