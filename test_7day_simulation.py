import json
import time
from backend.app.db.database import init_db, get_all_formulas, get_formula_by_id
from backend.app.formulas.discovery import ALL_FORMULA_CATEGORIES
from backend.app.formulas.validator import validate_layer_1, validate_layer_2
from backend.app.simulation.engine import simulate_formula_performance
from backend.app.simulation.scenarios import AVAILABLE_SCENARIOS
from backend.app.agents.specialists import ALL_SPECIALIST_AGENTS
from backend.app.optimization.pareto import run_multi_objective_comparison

init_db()

print("=================================================================")
print("  SABZAAR 7-DAY (168-HOUR) ENVIRONMENTAL PHYSICS SIMULATION LOOP")
print("  COMPARING 6 FORMULAS ON EXISTING CONCRETE WALL RETROFIT")
print("=================================================================\n")

# Check all formulas mass balance
for code, fdata in ALL_FORMULA_CATEGORIES.items():
    l1 = fdata["layer_1"]["ingredients"]
    l2 = fdata["layer_2"]["ingredients"]
    v1, m1, s1 = validate_layer_1(l1)
    v2, m2 = validate_layer_2(l2)
    print(f"[{code}] {fdata['name']}: L1 Valid={v1} ({s1:.2f}%), L2 Valid={v2}")

print("\n--- RUNNING 7-DAY (168-HOUR) SIMULATION ACROSS SCENARIOS ---")
scenarios_to_run = ["islamabad_summer", "islamabad_monsoon", "lahore_summer"]

sim_7day_results = {}
for code, fdata in ALL_FORMULA_CATEGORIES.items():
    sim_7day_results[code] = {}
    for sc_id in scenarios_to_run:
        res = simulate_formula_performance(
            formula_data=fdata,
            scenario_id=sc_id,
            duration_hours=168,  # 7 FULL DAYS (168 HOURS)
            coat_thickness_mm=8.0
        )
        env = res["environmental_summary"]
        mat = res["material_properties"]
        eco = res["economic_summary"]
        sim_7day_results[code][sc_id] = {
            "viability_7d": env["biological_viability_score"],
            "total_evap_168h": env["total_evaporation_liters_m2"],
            "peak_wall_temp": env["peak_wall_temperature_c"],
            "min_moisture": env["min_moisture_saturation_pct"],
            "avg_stress": env["average_biological_stress_index"],
            "porosity_pct": mat["total_porosity_pct"],
            "compressive_strength_mpa": mat["compressive_strength_28d_mpa"],
            "l1_cost_pkr_m2": eco["layer_1_cost_pkr_m2"],
            "l2_cost_pkr_m2": eco["layer_2_cost_pkr_m2"],
            "total_cost_pkr_m2": eco["total_material_cost_pkr_m2"]
        }
        print(f"  {code} @ {sc_id} (7d): Viability={env['biological_viability_score']}/100, Peak Temp={env['peak_wall_temperature_c']}C, Evap={env['total_evaporation_liters_m2']:.1f} L/m2, Cost=PKR {eco['total_material_cost_pkr_m2']}/m2")

print("\n--- MULTI-OBJECTIVE PARETO RANKING ACROSS ALL FORMULAS ---")
pareto = run_multi_objective_comparison()
for rank, item in enumerate(pareto["rankings"], 1):
    scores = item["dimensional_scores"]
    print(f"#{rank} {item['formula_code']}: Composite={item['composite_utility_score']:.2f}/100 | Cost Score={scores['material_and_mfg_cost']}/100 | Bio Score={scores['biological_viability']}/100 | Local Avail={scores['local_material_availability']}/100")

with open("sim_7day_comparison_output.json", "w") as f:
    json.dump({
        "sim_7day_results": sim_7day_results,
        "pareto": pareto
    }, f, indent=2)

print("\n7-day simulation completed and saved to sim_7day_comparison_output.json")
