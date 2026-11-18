import os
import sys
from pathlib import Path

# Add project root directory to sys.path so 'backend' package imports resolve correctly
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.main import app

# Vercel Serverless Function entrypoint
# Exposes the FastAPI ASGI app directly to the Vercel Python runtime
