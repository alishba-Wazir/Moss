"""
Predefined and Configurable Environmental Scenarios
Default Location: ISLAMABAD, PAKISTAN (Station 415710, 540m elev, Cwa)
Ground truth data calibrated against Pakistan Meteorological Department (PMD) 30-year climate normals.
"""

from typing import Dict, Any, List
import math
from .weather import LOCATIONS_REGISTRY

def generate_diurnal_weather_series(
    scenario_id: str = "islamabad_default",
    duration_hours: int = 48,
    custom_temp_min: float = None,
    custom_temp_max: float = None,
    custom_rh_min: float = None,
    custom_rh_max: float = None,
    custom_wind_mean: float = None,
    custom_solar_peak: float = None,
    irrigation_schedule_hours: List[int] = None,
    irrigation_volume_liters: float = None,
    rain_events: Dict[int, float] = None
) -> List[Dict[str, float]]:
    """
    Generates hourly meteorological timeseries data for simulation.
    Defaults strictly to Islamabad, Pakistan.
    """
    loc = LOCATIONS_REGISTRY.get(scenario_id, LOCATIONS_REGISTRY["islamabad_default"])
    base = loc["baseline_climate"]
    
    t_min = custom_temp_min if custom_temp_min is not None else base["t_min"]
    t_max = custom_temp_max if custom_temp_max is not None else base["t_max"]
    rh_min = custom_rh_min if custom_rh_min is not None else base["rh_min"]
    rh_max = custom_rh_max if custom_rh_max is not None else base["rh_max"]
    solar_peak = custom_solar_peak if custom_solar_peak is not None else base["solar_peak_w_m2"]
    wind_mean = custom_wind_mean if custom_wind_mean is not None else base["wind_mean_m_s"]
    
    irrig_hours = irrigation_schedule_hours if irrigation_schedule_hours is not None else base.get("default_irrigation_hours", [])
    irrig_vol = irrigation_volume_liters if irrigation_volume_liters is not None else base.get("default_irrigation_vol_l", 0.4)
    rain_dict = rain_events if rain_events is not None else base.get("rain_events", {})
    
    timeseries = []
    
    for h in range(duration_hours):
        hour_of_day = h % 24
        
        # Diurnal temperature cycle: peak at 14:00 (hour 14), minimum at 05:00
        temp_rad = 2.0 * math.pi * ((hour_of_day - 5.0) / 24.0)
        t_current = t_min + (t_max - t_min) * (0.5 * (1.0 - math.cos(temp_rad)))
        
        # Diurnal RH cycle: inverse of temperature
        rh_current = rh_max - (rh_max - rh_min) * (0.5 * (1.0 - math.cos(temp_rad)))
        
        # Solar radiation: only during daylight (06:00 to 18:30)
        if 6 <= hour_of_day <= 18:
            solar_rad = math.sin(math.pi * (hour_of_day - 6.0) / 12.0)
            solar_current = max(0.0, solar_peak * math.pow(solar_rad, 1.2))
        else:
            solar_current = 0.0
            
        # Micro-turbulent wind variations
        wind_current = max(0.2, wind_mean + 0.35 * math.sin(h * 0.5))
        
        # Rainfall and misting water inputs
        rain_val = rain_dict.get(h, 0.0)
        irrig_val = irrig_vol if hour_of_day in irrig_hours else 0.0
        
        timeseries.append({
            "hour": h,
            "hour_of_day": hour_of_day,
            "temp_c": round(t_current, 2),
            "rh_pct": round(rh_current, 2),
            "solar_w_m2": round(solar_current, 1),
            "wind_m_s": round(wind_current, 2),
            "rain_mm": rain_val,
            "irrigation_liters": irrig_val
        })
        
    return timeseries

AVAILABLE_SCENARIOS = {
    "islamabad_default": "Islamabad, Pakistan (DEFAULT TARGET: 22–34°C, 45–80% RH, High Bioreceptivity)",
    "islamabad_monsoon": "Islamabad Shaded Monsoon (July–Aug: 24–33°C, 65–95% RH, Heavy Natural Rainfall)",
    "islamabad_summer": "Islamabad Pre-Monsoon Summer (May–June: 25–39°C, 28–58% RH, Peak Sun)",
    "lahore_summer": "Lahore Extreme Summer Peak (June: 31–45°C, 22–52% RH, Severe Heat Stress)",
    "karachi_coastal": "Karachi Coastal Marine (May: 28–36°C, High Saline Humidity, Breeze)",
    "quetta_arid": "Quetta High-Altitude Arid (Oct: 8–26°C, Low Humidity, Diurnal Frost Swing)",
    "murree_hills": "Murree Foothills (Highland: 15–25°C, 60–90% RH, 1,789mm Rain)",
    "standard_lab": "Standard Controlled Laboratory Bench (25°C, 65% RH, 48h Baseline Chamber)"
}
