"""
Process Comparison and Evaluation Engine
Evaluates manufacturing workflows against formulas from Session 1.
Computes multi-dimensional trade-offs across:
- Capex & Opex
- Cycle time & scalability
- Carbon & energy intensity
- Risk of failure & quality assurance
"""

from typing import Dict, Any, List
from .stages import PROCESS_STAGES_METADATA, ALTERNATIVE_WORKFLOWS

def evaluate_process_workflow(workflow_id: str, formula_category: str = "FORMULA_A") -> Dict[str, Any]:
    """
    Evaluates a specific manufacturing workflow with a given formulation category.
    """
    wf = ALTERNATIVE_WORKFLOWS.get(workflow_id)
    if not wf:
        return {"error": f"Unknown workflow id '{workflow_id}'"}
        
    # Formula-specific compatibility and adjustments
    formula_multipliers = {
        "FORMULA_A": { # Standard OPC baseline: needs 21 day carbonation
            "curing_days": 21,
            "complexity_factor": 1.0,
            "compatibility_note": "Standard baseline compatibility. 21-day curing window mandatory."
        },
        "FORMULA_B": { # Ideal MPC: rapid set (30 min), low pH from day 1, no 21-day delay!
            "curing_days": 3,
            "complexity_factor": 1.25, # MPC needs strict retarding and fast mixing
            "compatibility_note": "MPC sets in 30 minutes; requires borax retarder and rapid pump placement. Fast 3-day turnaround."
        },
        "FORMULA_C": { # Recycled GGBS/RHA: slow early strength, needs good moisture curing
            "curing_days": 14,
            "complexity_factor": 1.1,
            "compatibility_note": "Slag/RHA mix has lower heat of hydration; needs 5 days continuous moisture curing."
        },
        "FORMULA_D": { # Lime-Surkhi: slow atmospheric carbonation, low pump pressure
            "curing_days": 18,
            "complexity_factor": 0.9,
            "compatibility_note": "Thixotropic bentonite clay enables smooth low-cost pumpability with minimal wear."
        }
    }
    
    f_adj = formula_multipliers.get(formula_category, formula_multipliers["FORMULA_A"])
    
    # Calculate comparative metrics
    effective_curing_days = f_adj["curing_days"]
    if workflow_id == "workflow_3_precast":
        # Precast accelerated CO2 chamber drops curing to 2 days for all cement types!
        effective_curing_days = 2
        
    # Scoring out of 100 for key criteria
    scores = {}
    if workflow_id == "workflow_1_shotcrete":
        scores = {
            "application_speed": 92.0,
            "mechanical_bond_quality": 88.0,
            "porosity_preservation": 82.0,
            "equipment_accessibility": 65.0,
            "cost_efficiency": 78.0,
            "overall_suitability": 84.0
        }
    elif workflow_id == "workflow_2_manual":
        scores = {
            "application_speed": 45.0,
            "mechanical_bond_quality": 68.0,
            "porosity_preservation": 58.0, # risk of trowel smoothing pores
            "equipment_accessibility": 95.0,
            "cost_efficiency": 82.0,
            "overall_suitability": 68.0
        }
    elif workflow_id == "workflow_3_precast":
        scores = {
            "application_speed": 85.0, # rapid on-site assembly
            "mechanical_bond_quality": 95.0, # factory precision
            "porosity_preservation": 94.0, # vibration casting without pore-smearing
            "equipment_accessibility": 40.0, # requires factory & transport
            "cost_efficiency": 55.0, # highest capex
            "overall_suitability": 79.0
        }
        
    return {
        "workflow_id": workflow_id,
        "name": wf["name"],
        "type": wf["type"],
        "target_formula": formula_category,
        "effective_curing_days": effective_curing_days,
        "applicability": wf["applicability"],
        "machinery": wf["machinery_and_tools"],
        "labour_requirement": wf["labour_requirement"],
        "processing_speed": wf["processing_time"],
        "water_consumption_l_m2": wf["water_consumption_per_m2_liters"],
        "energy_kwh_m2": wf["energy_kwh_per_m2"],
        "processing_cost_pkr_m2": wf["estimated_cost_pkr_m2"],
        "safety_notes": wf["safety_requirements"],
        "advantages": wf["advantages"],
        "disadvantages": wf["disadvantages"],
        "failure_modes": wf["failure_modes_and_mitigation"],
        "scores": scores,
        "compatibility_notes": f_adj["compatibility_note"]
    }

def compare_all_workflows(formula_category: str = "FORMULA_A") -> Dict[str, Any]:
    """
    Runs cross-comparison across all 3 alternative manufacturing workflows.
    """
    evaluations = [
        evaluate_process_workflow(w_id, formula_category)
        for w_id in ALTERNATIVE_WORKFLOWS.keys()
    ]
    
    # Identify ranking
    ranked = sorted(evaluations, key=lambda x: x["scores"]["overall_suitability"], reverse=True)
    
    return {
        "formula_category": formula_category,
        "total_stages": len(PROCESS_STAGES_METADATA),
        "stages_catalog": PROCESS_STAGES_METADATA,
        "evaluations": evaluations,
        "top_recommended_workflow": ranked[0]["workflow_id"],
        "rationale": (
            f"For {formula_category}, {ranked[0]['name']} provides the optimal balance of "
            f"open macro-porosity retention, high substrate bond strength, and productivity."
        )
    }
