import os
from pathlib import Path
from dotenv import load_dotenv

# Load local .env if present
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(ROOT_DIR / ".env")

class Settings:
    PROJECT_NAME: str = "Sabzaar Moss Wall Research Laboratory"
    API_PREFIX: str = "/api"
    ROOT_DIR: Path = ROOT_DIR
    DATABASE_PATH: Path = Path("/tmp/research_lab.db") if os.getenv("VERCEL") else (ROOT_DIR / "backend" / "research_lab.db")
    INPUTS_DIR: Path = ROOT_DIR / "inputs"
    HTML_BASELINE_FILE: Path = ROOT_DIR / "inputs" / "sabzaar-living-walls-standalone.html"
    
    # Gemini API settings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-4-argon")
    
    # Defaults
    DEFAULT_TARGET_LOCATION: str = "Islamabad, Pakistan"
    DEFAULT_SCENARIO_ID: str = "islamabad_default"
    DEFAULT_SIMULATION_HOURS: int = 48
    DEFAULT_AREA_M2: float = 100.0
    DEFAULT_COAT_A_THICKNESS_MM: float = 8.0
    DEFAULT_COAT_A_WASTE_PCT: float = 15.0

    @classmethod
    def set_gemini_key(cls, key: str, model: str = None):
        os.environ["GEMINI_API_KEY"] = key.strip()
        settings.GEMINI_API_KEY = key.strip()
        target_model = model.strip() if model else os.getenv("GEMINI_MODEL", "gemini-4-argon")
        os.environ["GEMINI_MODEL"] = target_model
        settings.GEMINI_MODEL = target_model

settings = Settings()
