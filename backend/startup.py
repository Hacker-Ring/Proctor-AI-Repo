"""
Azure Web App startup script for FastAPI backend
This file is used by Azure to start the FastAPI application
"""

import os
import sys
import uvicorn
from pathlib import Path

# Add the current directory to Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

if __name__ == "__main__":
    # Azure Web App configuration
    port = int(os.environ.get("PORT", 8000))
    
    # Import the app after setting up the path
    from main import app
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        log_level="info",
        access_log=True
    )
