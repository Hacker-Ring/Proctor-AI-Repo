#!/bin/bash

# Azure Portal Deployment Script
# This script prepares files for Azure Portal deployment

echo "🚀 Preparing files for Azure Portal Deployment"
echo "============================================="

# Navigate to backend directory
cd backend

# Create a clean deployment directory
mkdir -p ../azure-deploy
cp -r . ../azure-deploy/
cd ../azure-deploy

# Remove unnecessary files
rm -rf venv/
rm -rf __pycache__/
rm -rf services/__pycache__/
rm -rf *.pyc
rm -rf .env
rm -rf server.log
rm -rf .git/
rm -rf *.zip

# Create a simple requirements.txt with essential packages
cat > requirements.txt << EOF
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
python-dotenv==1.0.0
requests==2.31.0
websockets==12.0
twilio==8.10.0
supabase==2.3.0
openai==1.6.1
aiofiles==23.2.1
python-multipart==0.0.6
httpx==0.27.0
EOF

# Create a simple startup.py
cat > startup.py << 'EOF'
"""
Azure Web App startup script for FastAPI backend
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
EOF

# Create a simple main.py if it doesn't exist
if [ ! -f "main.py" ]; then
    cat > main.py << 'EOF'
"""
Simple FastAPI application for Azure deployment
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Voice Agent Backend", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Voice Agent Backend is running!", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Service is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
EOF
fi

echo "✅ Files prepared for Azure Portal deployment"
echo ""
echo "📁 Deployment files are in: ../azure-deploy/"
echo ""
echo "🌐 Next steps:"
echo "1. Go to Azure Portal → voice-agent-backend-server → Deployment Center"
echo "2. Choose 'Local Git' as source"
echo "3. Copy the Git URL"
echo "4. Run: cd ../azure-deploy && git init && git add . && git commit -m 'Deploy'"
echo "5. Run: git remote add azure <GIT_URL> && git push azure main"
echo ""
echo "Or use the Azure Portal's file upload feature to upload the files directly."
