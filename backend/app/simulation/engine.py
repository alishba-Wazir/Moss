"""
Full Numerical Environmental Simulation Engine for Living Wall Formulations
Runs step-by-step physical mass and energy balances over arbitrary duration (default 48h).
Generates detailed time-series telemetry and aggregate performance metrics.
"""

from typing import Dict, Any, List, Optional
from .physics import (
    calculate_formula_porosity_and_density,
    estimate_mechanical_properties,
    calculate_ph_evolution,
    run_hourly_environmental_step
)
from .scenarios import generate_diurnal_weather_series
from .weather import LOCATIONS_REGISTRY
from ..formulas.validator import validate_layer_1, validate_layer_2
import datetime
import time

def simulate_formula_performance(
    formula_data: Dict[str, Any],
    scenario_id: str = "islamabad_default",
    duration_hours: int = 48,
    coat_thickness_mm: float = 8.0,
    custom_temp_min: Optional[float] = None,
    custom_temp_max: Optional[float] = None,
    custom_rh_min: Optional[float] = None,
    custom_rh_max: Optional[float] = None,
    custom_wind_mean: Optional[float] = None,
    custom_solar_peak: Optional[float] = None,
    irrigation_hours: Optional[List[int]] = None,
    irrigation_volume_l: Optional[float] = None
) -> Dict[str, Any]:
    """
    Executes a complete environmental simulation for a given formula.
    """
    t_start = time.perf_counter()
    layer1_ingredients = formula_data.get("layer_1", {}).get("ingredients", [])
    layer2_ingredients = formula_data.get("layer_2", {}).get("ingredients", [])
    
    # Validation check
    l1_valid, l1_msg, l1_pct = validate_layer_1(layer1_ingredients)
    l2_valid, l2_msg = validate_layer_2(layer2_ingredients)
    
    # Porosity and density
    porosity_pct, bulk_density, matrix_density = calculate_formula_porosity_and_density(layer1_ingredients)
    
    # Water storage capacity (L/m2)
    # Porous retention factor ~ 0.22 - 0.32 L per m2 per mm
    porous_factor = 0.20 + (porosity_pct / 100.0) * 0.15
    has_sap = any("sap" in i.get("id", "").lower() or "absorbent" in i.get("name", "").lower() for i in layer1_ingredients)
    if has_sap:
        porous_factor += 0.04
        
    max_storage_liters_m2 = coat_thickness_mm * porous_factor
    
    # Mechanical properties
    mech_props = estimate_mechanical_properties(layer1_ingredients, porosity_pct)
    
    # pH evolution trajectory across 28 days
    ph_trajectory = [
        {"day": d, "surface_ph": calculate_ph_evolution(layer1_ingredients, d)}
        for d in [0, 1, 3, 7, 14, 21, 28, 60, 90]
    ]
    initial_ph = ph_trajectory[0]["surface_ph"]
    ph_at_21d = ph_trajectory[5]["surface_ph"]
    
    # Weather timeseries
    weather_series = generate_diurnal_weather_series(
        scenario_id=scenario_id,
        duration_hours=duration_hours,
        custom_temp_min=custom_temp_min,
        custom_temp_max=custom_temp_max,
        custom_rh_min=custom_rh_min,
        custom_rh_max=custom_rh_max,
        custom_wind_mean=custom_wind_mean,
        custom_solar_peak=custom_solar_peak,
        irrigation_schedule_hours=irrigation_hours,
        irrigation_volume_liters=irrigation_volume_l
    )
    
    # Run hourly simulation
    # Initial condition: pre-wetted wall at 70% storage
    current_storage = max_storage_liters_m2 * 0.70
    has_alginate = any("alginate" in i.get("id", "").lower() or "pectin" in i.get("id", "").lower() for i in layer2_ingredients)
    
    hourly_telemetry = []
    total_evap = 0.0
    total_water_added = 0.0
    stress_sum = 0.0
    peak_wall_temp = -999.0
    min_moisture_seen = 100.0
    
    for step in weather_series:
        h = step["hour"]
        res = run_hourly_environmental_step(
            current_storage_liters=current_storage,
            max_storage_liters=max_storage_liters_m2,
            ambient_temp_c=step["temp_c"],
            rh_pct=step["rh_pct"],
            solar_radiation_w_m2=step["solar_w_m2"],
            wind_speed_m_s=step["wind_m_s"],
            rain_mm=step["rain_mm"],
            irrigation_liters=step["irrigation_liters"],
            coat_thickness_mm=coat_thickness_mm,
            has_alginate_gel=has_alginate,
            has_sap=has_sap
        )
        
        current_storage = res["stored_water_l"]
        total_evap += res["evaporation_l"]
        total_water_added += res["water_input_l"]
        stress_sum += res["biological_stress_index"]
        
        if res["wall_surface_temp_c"] > peak_wall_temp:
            peak_wall_temp = res["wall_surface_temp_c"]
        if res["moisture_saturation_pct"] < min_moisture_seen:
            min_moisture_seen = res["moisture_saturation_pct"]
            
        hourly_telemetry.append({
            "hour": h,
            "hour_of_day": step["hour_of_day"],
            "ambient_temp_c": step["temp_c"],
            "wall_surface_temp_c": res["wall_surface_temp_c"],
            "cooling_effect_c": res["cooling_effect_c"],
            "rh_pct": step["rh_pct"],
            "solar_w_m2": step["solar_w_m2"],
            "wind_m_s": step["wind_m_s"],
            "rain_mm": step["rain_mm"],
            "irrigation_l": step["irrigation_liters"],
            "evaporation_l": res["evaporation_l"],
            "stored_water_l": res["stored_water_l"],
            "moisture_saturation_pct": res["moisture_saturation_pct"],
            "moss_rwc_pct": res["moss_rwc_pct"],
            "biological_stress_index": res["biological_stress_index"]
        })
        
    avg_stress = stress_sum / max(1, duration_hours)
    # Biological viability score (0 - 100)
    bioviability_score = round(max(0.0, min(100.0, (1.0 - avg_stress) * 100.0)), 1)
    
    # Material costs estimate per m2
    layer1_dry_kg_m2 = coat_thickness_mm * 1.37 * 1.15
    cost_l1 = sum(float(i.get("percentage", 0.0))/100.0 * float(i.get("cost_pkr_kg", 0.0)) for i in layer1_ingredients) * layer1_dry_kg_m2
    spray_rate_l2 = float(formula_data.get("layer_2", {}).get("specs", {}).get("application_rate_liters_per_m2", 1.5))
    cost_l2 = sum(float(i.get("amount", 0.0)) * float(i.get("cost_pkr_per_unit", 0.0)) for i in layer2_ingredients if i.get("unit") != "L") * spray_rate_l2
    total_material_cost_m2 = round(cost_l1 + cost_l2, 2)
    
    loc_meta = LOCATIONS_REGISTRY.get(scenario_id, LOCATIONS_REGISTRY["islamabad_default"])
    now_utc = datetime.datetime.now(datetime.timezone.utc).isoformat()
    t_end = time.perf_counter()
    real_exec_s = round(t_end - t_start, 5)
    real_exec_ms = round((t_end - t_start) * 1000.0, 2)

    return {
        "status": "COMPLETED",
        "scenario_id": scenario_id,
        "location_name": loc_meta["name"],
        "data_source": loc_meta["provenance_standard"],
        "simulation_timestamp": now_utc,
        "simulated_duration_hours": duration_hours,
        "simulated_duration_seconds": duration_hours * 3600,
        "real_execution_duration_ms": real_exec_ms,
        "real_execution_duration_seconds": real_exec_s,
        "duration_hours": duration_hours,
        "validations": {
            "layer_1_valid": l1_valid,
            "layer_1_message": l1_msg,
            "layer_1_sum_pct": round(l1_pct, 2),
            "layer_2_valid": l2_valid,
            "layer_2_message": l2_msg
        },
        "material_properties": {
            "total_porosity_pct": round(porosity_pct, 1),
            "bulk_density_kg_m3": round(bulk_density, 1),
            "matrix_density_kg_m3": round(matrix_density, 1),
            "max_water_storage_liters_m2": round(max_storage_liters_m2, 2),
            "compressive_strength_28d_mpa": mech_props["compressive_strength_28d_mpa"],
            "flexural_strength_28d_mpa": mech_props["flexural_strength_28d_mpa"],
            "substrate_bond_strength_mpa": mech_props["substrate_bond_strength_mpa"]
        },
        "ph_dynamics": {
            "initial_ph": initial_ph,
            "ph_at_21_days": ph_at_21d,
            "carbonation_trajectory": ph_trajectory
        },
        "environmental_summary": {
            "total_evaporation_liters_m2": round(total_evap, 2),
            "total_water_added_liters_m2": round(total_water_added, 2),
            "final_stored_water_liters_m2": round(current_storage, 2),
            "peak_wall_temperature_c": round(peak_wall_temp, 1),
            "min_moisture_saturation_pct": round(min_moisture_seen, 1),
            "average_biological_stress_index": round(avg_stress, 3),
            "biological_viability_score": bioviability_score
        },
        "economic_summary": {
            "layer_1_cost_pkr_m2": round(cost_l1, 2),
            "layer_2_cost_pkr_m2": round(cost_l2, 2),
            "total_material_cost_pkr_m2": total_material_cost_m2
        },
        "telemetry": hourly_telemetry
    }
