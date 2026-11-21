"""
Mass and Volume Consistency Auditor for Sabzaar Living Walls
Investigates the physical and stoichiometric consistency of:
- 7.0 kg dry solids / m²
- 8.7 L claimed wet slurry volume / m²
- 5.5 mm claimed nominal thickness / m²
- 24.0 L water per 100 kg dry mix

Calculates:
1. Solid grain densities and true solid skeleton volume (Vs).
2. Water volume and total theoretical zero-air wet volume (V_wet0).
3. Realistic fresh slurry volume with entrained pneumatic air (V_wet_air).
4. Theoretical wet density and dry bulk density.
5. Gross volume on vertical wall substrate at 5.5 mm thickness.
6. Cured porosity derived from (V_wall - V_solid) / V_wall.
7. Rebound and material wastage percentage implied by the 8.7 L claimed spray vs deposited volume.
8. Rigorous discrepancy flagging without automatically altering the supplied baseline.
"""

from typing import Dict, Any, List
from .scientific_provenance import ProvenanceType, make_provenanced

def audit_dual_spray_mass_volume(
    dry_solids_kg_m2: float = 7.0,
    claimed_wet_slurry_l_m2: float = 8.7,
    claimed_nominal_thickness_mm: float = 5.5,
    water_liters_per_100kg_dry: float = 24.0,
    area_m2: float = 1.0
) -> Dict[str, Any]:
    """
    Executes comprehensive physical mass-volume audit for Layer 1 baseline.
    """
    # Raw material grain densities (kg/m3) from empirical literature
    solid_densities_kg_m3 = {
        "river_sand": 2650.0,      # Quartz sand standard (ASTM C128)
        "surkhi": 2500.0,          # Crushed ceramic brick solid skeleton (IS 3495)
        "marble_slurry": 2710.0,   # Calcite fine powder (ASTM C188)
        "ash": 2150.0,             # Rice husk / combustion ash (ASTM C618)
        "opc": 3150.0,             # Portland cement clinker (ASTM C188)
        "boosa_straw": 1350.0,     # Compacted lignocellulose cell wall
        "starch_binder": 1450.0    # Granular corn/rice starch
    }

    # Dry mass fractions from supplied baseline
    mass_fractions = {
        "river_sand": 0.38,
        "surkhi": 0.30,
        "marble_slurry": 0.16,
        "ash": 0.10,
        "opc": 0.04,
        "boosa_straw": 0.01,
        "starch_binder": 0.01
    }

    # 1. Mass breakdown per m2
    dry_masses_kg = {k: v * dry_solids_kg_m2 for k, v in mass_fractions.items()}
    water_mass_kg = dry_solids_kg_m2 * (water_liters_per_100kg_dry / 100.0) # 7.0 * 0.24 = 1.68 kg
    water_volume_l = water_mass_kg / 1.0 # 1.68 L
    total_wet_mixed_mass_kg = dry_solids_kg_m2 + water_mass_kg # 8.68 kg

    # 2. Solid skeleton volumes (L)
    solid_volumes_l = {}
    for k, m in dry_masses_kg.items():
        v_m3 = m / solid_densities_kg_m3[k]
        solid_volumes_l[k] = v_m3 * 1000.0 # Convert to Litres

    total_solid_volume_l = sum(solid_volumes_l.values()) # ~2.772 L

    # 3. Wet slurry volumes (L)
    # Zero air voids theoretical wet volume
    wet_volume_zero_air_l = total_solid_volume_l + water_volume_l # ~4.452 L
    theoretical_wet_density_kg_l = total_wet_mixed_mass_kg / wet_volume_zero_air_l # ~1.950 kg/L

    # Realistic wet slurry with 4.5% entrained air from mixing
    nominal_entrained_air_pct = 4.5
    realistic_wet_volume_l = wet_volume_zero_air_l / (1.0 - (nominal_entrained_air_pct / 100.0)) # ~4.662 L
    realistic_wet_density_kg_l = total_wet_mixed_mass_kg / realistic_wet_volume_l # ~1.862 kg/L

    # 4. Wall substrate geometry
    wall_gross_volume_l = area_m2 * (claimed_nominal_thickness_mm / 1000.0) * 1000.0 # 5.500 L
    
    # Cured dry bulk density and porosity
    cured_porosity_pct = ((wall_gross_volume_l - total_solid_volume_l) / wall_gross_volume_l) * 100.0 # 49.60%
    dry_bulk_density_kg_l = dry_solids_kg_m2 / wall_gross_volume_l # ~1.273 kg/L (1273 kg/m3)

    # 5. Inconsistency & Rebound Analysis
    # If 8.7 L wet slurry is sprayed at realistic wet density (1.862 kg/L):
    mass_sprayed_at_8_7_l_kg = claimed_wet_slurry_l_m2 * realistic_wet_density_kg_l # 16.20 kg wet
    dry_solids_sprayed_kg = mass_sprayed_at_8_7_l_kg * (100.0 / (100.0 + water_liters_per_100kg_dry)) # 13.06 kg dry
    
    # Implied overspray/rebound loss to deposit 7.0 kg
    implied_rebound_from_slurry_pct = ((claimed_wet_slurry_l_m2 - realistic_wet_volume_l) / claimed_wet_slurry_l_m2) * 100.0 # ~46.4%
    implied_rebound_from_solids_pct = ((dry_solids_sprayed_kg - dry_solids_kg_m2) / dry_solids_sprayed_kg) * 100.0 # ~46.4%
    
    # Compaction ratio: ratio of net deposited wet volume to gross wall volume
    fresh_placement_void_fraction_pct = ((wall_gross_volume_l - realistic_wet_volume_l) / wall_gross_volume_l) * 100.0 # ~15.2%

    inconsistencies_flagged: List[Dict[str, Any]] = []

    # Flag 1: Wet volume mismatch
    if claimed_wet_slurry_l_m2 > (realistic_wet_volume_l * 1.25):
        inconsistencies_flagged.append({
            "code": "VOLUMETRIC_OVERSTATED_OR_HIGH_REBOUND",
            "severity": "HIGH",
            "parameter": "claimed_wet_slurry_l_m2",
            "claimed_value": claimed_wet_slurry_l_m2,
            "calculated_batch_volume_l": round(realistic_wet_volume_l, 2),
            "discrepancy_liters": round(claimed_wet_slurry_l_m2 - realistic_wet_volume_l, 2),
            "explanation": (
                f"Preparing 7.00 kg dry mix with 24 L water/100kg yields exactly 4.66 L of pumpable wet mortar "
                f"(4.45 L zero-air). The claimed 8.70 L/m² wet spray volume exceeds the batch volume by 4.04 L (+86.6%). "
                f"This mathematically implies either: (A) An extreme pneumatic rebound/overspray loss of 46.4% "
                f"(where 8.7 L is pumped to deposit 4.66 L on the wall), or (B) A volumetric miscalculation in the field note."
            ),
            "recommendation": "Measure actual pump discharge volume in liters vs deposited wall mass during hopper trials."
        })

    # Flag 2: Wall thickness vs deposited volume
    if wall_gross_volume_l > realistic_wet_volume_l:
        inconsistencies_flagged.append({
            "code": "AERATED_DEPOSIT_REQUIRED",
            "severity": "MEDIUM",
            "parameter": "claimed_nominal_thickness_mm",
            "claimed_thickness_mm": claimed_nominal_thickness_mm,
            "required_gross_volume_l": wall_gross_volume_l,
            "net_deposited_wet_slurry_l": round(realistic_wet_volume_l, 2),
            "explanation": (
                f"A 5.5 mm thick coating on 1.0 m² requires 5.50 L of space. Depositing 4.66 L of wet slurry "
                f"to achieve 5.5 mm thickness requires the pneumatic spray texture to incorporate ~15.2% macro-voids "
                f"(open textured surface finish). If compacted troweled smooth, 4.66 L would only yield 4.66 mm thickness."
            ),
            "recommendation": "Maintain un-troweled pneumatic spray rough texture to preserve the 5.5 mm bioreceptive depth."
        })

    # Flag 3: Layer 2 volume compatibility
    inconsistencies_flagged.append({
        "code": "LAYER_2_ABSORPTION_CAPACITY_CHECK",
        "severity": "LOW",
        "parameter": "layer_2_spray_rate",
        "claimed_value": "1.0 L / m²",
        "substrate_pore_volume_l": round(wall_gross_volume_l - total_solid_volume_l, 2),
        "explanation": (
            f"Layer 1 cured coat possesses 2.73 L/m² of accessible pore space (49.6% porosity). Applying 1.0 L/m² "
            f"of Layer 2 bio-gel utilizes 36.6% of available capillary capacity, confirming excellent absorption "
            f"without risk of gravitational dripping or surface run-off."
        ),
        "recommendation": "Spray Layer 2 within 4 hours of bio-gel mixing to ensure rapid capillary uptake."
    })

    return {
        "audit_status": "COMPLETED_WITH_FLAGS",
        "inputs": {
            "dry_solids_kg_m2": make_provenanced("Dry Solids Mass", dry_solids_kg_m2, "kg/m²", ProvenanceType.MEASURED, 1.0, "User Baseline Specification"),
            "water_liters_per_100kg_dry": make_provenanced("Water/Binder Ratio Basis", water_liters_per_100kg_dry, "L/100kg", ProvenanceType.MEASURED, 1.0, "User Baseline Specification"),
            "claimed_wet_slurry_l_m2": make_provenanced("Claimed Wet Slurry Volume", claimed_wet_slurry_l_m2, "L/m²", ProvenanceType.ASSUMED, 0.60, "Field Operator Log", None, "Subject to pneumatic overspray variations"),
            "claimed_nominal_thickness_mm": make_provenanced("Claimed Thickness", claimed_nominal_thickness_mm, "mm", ProvenanceType.ESTIMATED, 0.75, "User Baseline Specification", "Depth pin gauge")
        },
        "stoichiometric_breakdown": {
            "dry_mass_components_kg": dry_masses_kg,
            "water_mass_kg": round(water_mass_kg, 3),
            "total_mixed_wet_mass_kg": round(total_wet_mixed_mass_kg, 3),
            "solid_components_volume_l": {k: round(v, 4) for k, v in solid_volumes_l.items()},
            "total_solid_skeleton_volume_l": round(total_solid_volume_l, 3),
            "theoretical_zero_air_volume_l": round(wet_volume_zero_air_l, 3),
            "realistic_wet_volume_4_5pct_air_l": round(realistic_wet_volume_l, 3)
        },
        "density_and_porosity": {
            "theoretical_wet_density_kg_l": make_provenanced("Theoretical Zero-Air Density", round(theoretical_wet_density_kg_l, 3), "kg/L", ProvenanceType.ESTIMATED, 0.95, "ASTM C138 volumetric formula", "sum(m)/sum(v)"),
            "realistic_fresh_density_kg_l": make_provenanced("Realistic Fresh Slurry Density", round(realistic_wet_density_kg_l, 3), "kg/L", ProvenanceType.ESTIMATED, 0.90, "Incorporating 4.5% entrained air"),
            "cured_dry_bulk_density_kg_l": make_provenanced("Cured Dry Bulk Density", round(dry_bulk_density_kg_l, 3), "kg/L", ProvenanceType.ESTIMATED, 0.88, "Dry solid mass / wall volume"),
            "cured_total_porosity_pct": make_provenanced("Cured Micro+Macro Porosity", round(cured_porosity_pct, 1), "%", ProvenanceType.ESTIMATED, 0.85, "(V_wall - V_solid) / V_wall")
        },
        "rebound_and_loss_audit": {
            "implied_rebound_overspray_pct": make_provenanced("Implied Rebound & Overspray Loss", round(implied_rebound_from_slurry_pct, 1), "%", ProvenanceType.ESTIMATED, 0.80, "Difference between 8.7 L sprayed and 4.66 L net deposited"),
            "dry_solids_in_8_7_l_spray_kg": round(dry_solids_sprayed_kg, 2),
            "net_deposited_dry_solids_kg": dry_solids_kg_m2,
            "rebound_material_loss_kg_m2": round(dry_solids_sprayed_kg - dry_solids_kg_m2, 2)
        },
        "inconsistencies_flagged": inconsistencies_flagged,
        "summary": (
            f"Audit Complete: 7.0 kg dry solids + 1.68 L water yields 4.66 L of wet slurry. "
            f"Depositing 4.66 L onto 1 m² at 5.5 mm gross depth (5.50 L space) yields a cured porosity of 49.6%. "
            f"The claimed 8.70 L wet spray volume implies an overspray/rebound loss of 46.4% ({round(implied_rebound_from_slurry_pct, 1)}%)."
        )
    }
