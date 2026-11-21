"""
Master Research Prompt Orchestrator
Coordinates all 13 Specialist Subagents, delegates tasks, manages adversarial peer review,
and strictly enforces truthful execution status (DISCONNECTED / NOT_EXECUTED when Gemini API is inactive).
Default Target Location: ISLAMABAD, PAKISTAN.
"""

import os
import asyncio
import logging
import datetime
from typing import Dict, Any, List, Optional
from .specialists import ALL_SPECIALIST_AGENTS
from ..formulas.discovery import ALL_FORMULA_CATEGORIES
from ..config import settings
from ..db.database import get_connection

logger = logging.getLogger("sabzaar.orchestrator")

MASTER_RESEARCH_PROMPT_TEXT = """
SABZAAR LIVING WALLS: MASTER MULTI-AGENT RESEARCH & DISCOVERY PROMPT
Goal: Rigorously discover, characterize, simulate, and optimize a complete two-layer bioreceptive living wall system for harsh subtropical urban environments.
Primary Benchmark Location: ISLAMABAD, PAKISTAN (Station 415710, 540m elev, 1,261–1,904mm rain, Cwa).

Coordinate 6 Formulation Categories:
- Formula A: Original HTML / Idea-Based Formula (Immutable Reference Baseline)
- Formula B: Ideal Performance Formula (Low-alkali MPC, maximum water retention, rapid establishment)
- Formula C: Recyclable-Material Formula (Industrial GGBS slag, rice husk ash, recycled aggregates, circular economy)
- Formula D: Mineral-Based / Cost-Optimized Formula (Lime-surkhi heritage matrix, minimum cost)
- Formula E: Sabzaar Desi Eco-Matrix (Final Ultra-Low Cost Champion: PKR 54.15 / m², 100% Recyclable Local Materials for Existing Concrete Walls)
- Formula F: Mixed Food-Waste Biomass Ferment Matrix (PKR 50.20 / m², Calcined Kitchen Bio-Ash, Spent Tea, Fermented Starch & Sour Curd Whey)

Specialist Research Responsibilities:
1. Literature Research: Verify patent claims (WO2021172992A1 / EP4110743A1) and empirical peer-reviewed evidence.
2. Materials Science: Interconnected porosity, aggregate packing, capillary suction.
3. Cement Chemistry: pH neutralization, pozzolanic reactions, free lime consumption, MPC/lime alternatives.
4. Moss Biology: Species acclimation, gametophyte milling, viability under 45°C heat, non-toxic nutrient regimes.
5. Biological Carrier: Contact crosslinking kinetics, sodium alginate, psyllium tackifier, citrate buffering.
6. Water Retention: Penman-Monteith vertical evaporation, internal curing, SAP calcium stability.
7. Environmental Conditions: Microclimate zoning (Islamabad primary benchmark vs Lahore/Karachi), rain, UV.
8. Building Engineering: Concrete rebar corrosion, pull-off bond strength, dead load, fire safety.
9. Formulation Development: Dry-mix mass balance (strict 100%), Layer 2 g/L liquid ratios, recipe optimization.
10. Scientific Simulation: 48h+ deterministic physics engine, hydrological trajectory, stress scoring.
11. Multi-Objective Optimization: Pareto frontier, trade-offs between cost, biology, durability, and carbon.
12. Independent Critical Reviewer: Ruthlessly red-team all claims, expose lack of high-heat trials, prevent failure.
13. Process Discovery: 14 manufacturing/application stages, pneumatic spray vs manual trowel vs precast panels.

Directive: Collaboration and rigorous scientific debate are mandatory. Highlight disagreements, challenge unverified assumptions, and recommend actionable adjustments.
"""

class MasterOrchestrator:
    def __init__(self):
        self.master_prompt = MASTER_RESEARCH_PROMPT_TEXT
        self.agents = ALL_SPECIALIST_AGENTS
        self.is_running = False
        self.execution_history: List[Dict[str, Any]] = []

    async def run_full_research_cycle(
        self,
        target_formula_category: str = "FORMULA_A",
        target_location: str = "Islamabad, Pakistan",
        api_key: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes a complete coordinated research cycle across all 13 specialist subagents.
        STRICT TRUTHFULNESS: If Gemini is disconnected, reports DISCONNECTED and does NOT fake AI completion.
        """
        active_key = (api_key or os.getenv("GEMINI_API_KEY") or settings.GEMINI_API_KEY or "").strip()
        now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
        
        formula_data = ALL_FORMULA_CATEGORIES.get(target_formula_category, ALL_FORMULA_CATEGORIES["FORMULA_A"])

        if not active_key:
            self.is_running = False
            # Generate honest disconnected reports for all agents
            disconnected_reports = {}
            for aid, agent in self.agents.items():
                agent.status = "NOT_EXECUTED"
                agent.last_report = {
                    "agent_id": agent.agent_id,
                    "agent_name": agent.name,
                    "status": "NOT_EXECUTED",
                    "gemini_connected": False,
                    "execution_mode": "DISCONNECTED",
                    "message": "Gemini API is DISCONNECTED. Provide GEMINI_API_KEY to run live multi-agent research.",
                    "findings": [],
                    "recommendations": [],
                    "disagreements_with_peers": [],
                    "confidence_score": 0.0,
                    "timestamp_utc": now_iso,
                    "verdict_summary": "Agent has not executed. Awaiting active Gemini API connection."
                }
                disconnected_reports[aid] = agent.last_report

            return {
                "cycle_id": f"CYCLE-{target_formula_category}-DISCONNECTED",
                "target_formula_category": target_formula_category,
                "target_location": target_location,
                "gemini_connected": False,
                "execution_mode": "DISCONNECTED",
                "status": "DISCONNECTED",
                "message": "Gemini API is DISCONNECTED. Scientific Python physics simulations operate independently. To execute real multi-agent AI research, provide GEMINI_API_KEY in .env or via the dashboard.",
                "agent_reports": disconnected_reports,
                "total_agents_executed": 0,
                "consensus_confidence": 0.0,
                "key_disagreements": [],
                "recommendations": [],
                "critical_review": "Gemini API is disconnected. Independent Critical Reviewer has not executed.",
                "red_team_challenges": []
            }

        self.is_running = True
        logger.info(f"Initiating Genuine Gemini Research Cycle for {target_formula_category} in {target_location}")
        
        context = {
            "master_prompt": self.master_prompt,
            "target_formula": formula_data,
            "category_code": target_formula_category,
            "target_location": target_location,
            "pakistan_climate_focus": True
        }
        
        # Phase 1: Execute 12 primary specialists via genuine Gemini API calls with concurrency control
        reports: Dict[str, Any] = {}
        primary_agent_ids = [aid for aid in self.agents if aid != "agent_reviewer"]
        sem = asyncio.Semaphore(2)

        async def run_agent_guarded(agent_id: str):
            async with sem:
                res = await self.agents[agent_id].execute(context, api_key=active_key)
                await asyncio.sleep(0.5)
                return agent_id, res

        tasks = [run_agent_guarded(aid) for aid in primary_agent_ids]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        for item in results:
            if isinstance(item, Exception):
                logger.error(f"Agent execution encountered exception: {item}")
                continue
            aid, res = item
            if isinstance(res, Exception):
                logger.error(f"Agent {aid} threw an exception: {res}")
                reports[aid] = {
                    "agent_id": aid,
                    "status": "FAILED",
                    "error_message": str(res),
                    "gemini_connected": True,
                    "execution_mode": "FAILED",
                    "findings": [],
                    "recommendations": [],
                    "disagreements_with_peers": [],
                    "verdict_summary": f"Execution error: {str(res)}"
                }
            else:
                reports[aid] = res

        # Phase 2: Independent Critical Reviewer red-teams the findings
        reviewer_agent = self.agents["agent_reviewer"]
        collected_findings = [r.get("findings", []) for r in reports.values() if isinstance(r, dict)]
        flat_findings = [f for sublist in collected_findings for f in sublist]
        
        reviewer_context = {
            "target_formula": formula_data,
            "target_location": target_location,
            "peer_findings_summary": flat_findings,
            "instructions": "Critically red-team peer claims. Challenge unverified assumptions, thermal limits in Pakistan, and lack of physical testing."
        }
        reviewer_report = await reviewer_agent.execute(reviewer_context, api_key=active_key)
        reports["agent_reviewer"] = reviewer_report
        
        # Phase 3: Synthesize consensus, disagreements, and recommendations
        disagreements = []
        all_recommendations = []
        total_confidence = 0.0
        completed_count = 0
        
        for aid, rep in reports.items():
            if isinstance(rep, dict) and rep.get("status") == "COMPLETED":
                disagreements.extend(rep.get("disagreements_with_peers", []))
                all_recommendations.extend(rep.get("recommendations", []))
                total_confidence += float(rep.get("confidence_score", 0.85))
                completed_count += 1
                
        avg_confidence = round(total_confidence / max(1, completed_count), 2) if completed_count > 0 else 0.0
        
        # Categorize recommendations
        action_counts = {"KEEP": 0, "ADD": 0, "REMOVE": 0, "REPLACE": 0, "ADJUST": 0, "REDESIGN": 0}
        for rec in all_recommendations:
            act = rec.get("action", "").upper()
            if act in action_counts:
                action_counts[act] += 1
                
        cycle_status = "COMPLETED" if completed_count == len(reports) else ("PARTIAL" if completed_count > 0 else "FAILED_API_ERROR")
        
        summary_payload = {
            "cycle_id": f"CYCLE-{target_formula_category}-{int(datetime.datetime.now().timestamp())}",
            "target_formula_category": target_formula_category,
            "target_location": target_location,
            "gemini_connected": True,
            "execution_mode": "GEMINI_API",
            "status": cycle_status,
            "timestamp_utc": now_iso,
            "agent_reports": reports,
            "total_agents_executed": completed_count,
            "consensus_confidence": avg_confidence,
            "key_disagreements": list(set(disagreements)),
            "recommendation_summary": action_counts,
            "recommendations": all_recommendations,
            "critical_review": reviewer_report.get("verdict_summary", ""),
            "red_team_challenges": reviewer_report.get("findings", [])
        }
        
        # Save to SQLite
        try:
            conn = get_connection()
            c = conn.cursor()
            import json
            c.execute("""
            INSERT OR REPLACE INTO agent_cycles (id, formula_category, consensus_score, summary_json)
            VALUES (?, ?, ?, ?)
            """, (
                summary_payload["cycle_id"],
                target_formula_category,
                avg_confidence,
                json.dumps(summary_payload)
            ))
            conn.commit()
            conn.close()
        except Exception as e:
            logger.warning(f"Could not persist agent cycle to DB: {e}")

        self.execution_history.append(summary_payload)
        self.is_running = False
        return summary_payload

    def load_latest_cycle(self) -> Optional[Dict[str, Any]]:
        """Restores the most recent cycle and agent reports from SQLite storage."""
        try:
            conn = get_connection()
            c = conn.cursor()
            c.execute("SELECT summary_json FROM agent_cycles ORDER BY created_at DESC LIMIT 1")
            row = c.fetchone()
            conn.close()
            if row:
                import json
                cycle = json.loads(row[0])
                reports = cycle.get("agent_reports", {})
                for aid, r in reports.items():
                    if aid in self.agents and isinstance(r, dict):
                        self.agents[aid].status = r.get("status", "COMPLETED")
                        self.agents[aid].last_report = r
                return cycle
        except Exception as e:
            logger.warning(f"Could not load latest cycle from DB: {e}")
        return None

master_orchestrator = MasterOrchestrator()
