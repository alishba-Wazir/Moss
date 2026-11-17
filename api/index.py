import sys
import os
from pathlib import Path

# Add project root to sys.path so 'backend' can be resolved by Vercel serverless runtime
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from backend.app.main import app
