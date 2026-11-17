"""
Formula Mass Balance and Chemical Unit Validator
Enforces strict 100.0% mass balance for Layer 1 dry-mix (no silent redistribution).
Enforces correct chemical units (g/L, L) for Layer 2.
"""

from typing import List, Dict, Any, Tuple

TOLERANCE = 1e-4

def validate_layer_1(ingredients: List[Dict[str, Any]]) -> Tuple[bool, str, float]:
    """
    Validates Layer 1 dry mix mass balance.
    Must sum to exactly 100.0% (+/- TOLERANCE).
    Does NOT silently adjust or redistribute percentages.
    """
    if not ingredients:
        return False, "Layer 1 ingredient list cannot be empty.", 0.0
    
    total_pct = sum(float(item.get("percentage", 0.0)) for item in ingredients)
    
    # Check for negative or non-numerical values
    for item in ingredients:
        pct = float(item.get("percentage", 0.0))
        if pct < 0.0:
            return False, f"Ingredient '{item.get('name')}' has invalid negative percentage: {pct}%", total_pct
        if pct > 100.0:
            return False, f"Ingredient '{item.get('name')}' exceeds 100%: {pct}%", total_pct

    if abs(total_pct - 100.0) > 0.05:
        diff = total_pct - 100.0
        msg = (
            f"Mass balance violation: Total dry mix sums to {total_pct:.2f}% "
            f"({'surplus of +' if diff > 0 else 'deficit of '}{diff:.2f}%). "
            f"Layer 1 dry components must sum exactly to 100.00%. "
            f"Manual adjustment required; automated redistribution is prohibited."
        )
        return False, msg, total_pct
    
    return True, f"Mass balance valid (Total: {total_pct:.2f}%).", total_pct


def validate_layer_2(ingredients: List[Dict[str, Any]]) -> Tuple[bool, str]:
    """
    Validates Layer 2 units.
    Must maintain g/L or L units. Cannot be forced into a 100% dry balance.
    """
    if not ingredients:
        return False, "Layer 2 ingredient list cannot be empty."
    
    required_keys = ["id", "name", "amount", "unit"]
    has_water = False
    has_gelling_agent = False
    has_propagules = False
    
    for item in ingredients:
        for k in required_keys:
            if k not in item:
                return False, f"Layer 2 ingredient missing required property '{k}'."
        
        amt = float(item.get("amount", 0.0))
        unit = str(item.get("unit", "")).strip()
        
        if amt <= 0.0:
            return False, f"Ingredient '{item.get('name')}' must have an amount > 0 (found {amt} {unit})."
        
        if "alginate" in item.get("name", "").lower() or "gel" in item.get("category", "").lower():
            has_gelling_agent = True
        if "water" in item.get("name", "").lower():
            has_water = True
        if "moss" in item.get("name", "").lower() or "fragment" in item.get("name", "").lower():
            has_propagules = True

    if not has_water:
        return False, "Layer 2 missing aqueous carrier medium (water base)."
    if not has_gelling_agent:
        return False, "Layer 2 missing contact gelling polymer (e.g. sodium alginate)."
    if not has_propagules:
        return False, "Layer 2 missing biological moss propagules/fragments."

    return True, "Layer 2 formulation units and biological components verified."


def calculate_layer_1_job_quantities(
    ingredients: List[Dict[str, Any]],
    wall_area_m2: float = 100.0,
    thickness_mm: float = 8.0,
    waste_pct: float = 15.0,
    mixing_water_l_per_100kg: float = 28.0
) -> Dict[str, Any]:
    """
    Calculates exact kg requirements, water requirements, and costs for a given job size.
    Density factor: 1.37 kg dry premix per m2 per mm.
    """
    valid, msg, total_pct = validate_layer_1(ingredients)
    
    net_dry_kg = wall_area_m2 * thickness_mm * 1.37
    gross_dry_kg = net_dry_kg * (1.0 + (waste_pct / 100.0))
    mixing_water_liters = gross_dry_kg * (mixing_water_l_per_100kg / 100.0)
    
    total_cost_pkr = 0.0
    breakdown = []
    
    for item in ingredients:
        pct = float(item.get("percentage", 0.0))
        item_gross_kg = gross_dry_kg * (pct / 100.0)
        cost_per_kg = float(item.get("cost_pkr_kg", 0.0))
        item_cost = item_gross_kg * cost_per_kg
        total_cost_pkr += item_cost
        
        breakdown.append({
            "id": item.get("id"),
            "name": item.get("name"),
            "percentage": pct,
            "gross_kg": round(item_gross_kg, 2),
            "cost_pkr_kg": cost_per_kg,
            "total_cost_pkr": round(item_cost, 2)
        })
    
    # Cement bags (50kg) estimation
    binder_pct = sum(float(i.get("percentage", 0.0)) for i in ingredients if "cement" in i.get("name", "").lower())
    cement_kg = gross_dry_kg * (binder_pct / 100.0)
    cement_bags = int(round(cement_kg / 50.0 + 0.49))
    
    return {
        "valid_mass_balance": valid,
        "validation_message": msg,
        "wall_area_m2": wall_area_m2,
        "thickness_mm": thickness_mm,
        "waste_pct": waste_pct,
        "net_dry_mass_kg": round(net_dry_kg, 2),
        "gross_dry_mass_kg": round(gross_dry_kg, 2),
        "mixing_water_liters": round(mixing_water_liters, 2),
        "cement_bags_50kg": cement_bags,
        "estimated_water_storage_liters": round(wall_area_m2 * thickness_mm * 0.26, 2),
        "total_material_cost_pkr": round(total_cost_pkr, 2),
        "cost_per_m2_pkr": round(total_cost_pkr / max(1.0, wall_area_m2), 2),
        "breakdown": breakdown
    }
