# Azure Deployment Fix Guide

## Issues Identified and Fixed

### 1. **Missing Dependencies Error**

- **Problem**: `ModuleNotFoundError: No module named 'uvicorn'`
- **Root Cause**: Azure wasn't installing Python dependencies properly
- **Fix**: Updated deployment configuration to ensure dependencies are installed

### 2. **Python Version Mismatch**

- **Problem**: web.config specified Python 3.11, but Azure uses Python 3.10.18
- **Fix**: Updated web.config to use Python 3.10

### 3. **Startup Command Issues**

- **Problem**: Azure was trying to run `python3 run.py` instead of the configured startup command
- **Fix**: Updated startup.py and deployment configuration

### 4. **Missing Build Configuration**

- **Problem**: Azure wasn't building the Python environment properly
- **Fix**: Added proper build configuration and deployment settings

## Files Updated

1. **backend/web.config** - Updated Python version and build settings
2. **backend/.deployment** - Added deployment configuration
3. **backend/startup.py** - Improved startup script with better error handling
4. **backend/requirements.txt** - Pinned versions for better compatibility
5. **deploy-to-azure.sh** - Enhanced deployment script with proper configuration

## Deployment Steps

1. **Run the updated deployment script**:

   ```bash
   chmod +x deploy-to-azure.sh
   ./deploy-to-azure.sh
   ```

2. **Or deploy manually**:

   ```bash
   cd backend
   zip -r ../deployment-package.zip . -x "*.pyc" "__pycache__/*" "venv/*" ".env" "server.log"

   az webapp config set \
       --resource-group voice-agent-backend-resource-grp \
       --name voice-agent-backend-server \
       --python-version 3.10

   az webapp config set \
       --resource-group voice-agent-backend-resource-grp \
       --name voice-agent-backend-server \
       --startup-file "startup.py"

   az webapp deployment source config-zip \
       --resource-group voice-agent-backend-resource-grp \
       --name voice-agent-backend-server \
       --src ../deployment-package.zip
   ```

## Key Changes Made

- **Python Version**: Changed from 3.11 to 3.10 to match Azure's available version
- **Dependencies**: Pinned specific versions for better compatibility
- **Startup Script**: Improved error handling and path management
- **Build Configuration**: Added proper build settings for Azure
- **Deployment Script**: Enhanced with proper web app configuration

## Expected Results

After deployment, you should see:

- ✅ Dependencies installed successfully
- ✅ Application starting without module errors
- ✅ Server running on port 8000
- ✅ Health checks passing

## Troubleshooting

If you still encounter issues:

1. **Check logs**: `az webapp log tail --name voice-agent-backend-server --resource-group voice-agent-backend-resource-grp`

2. **Verify configuration**: `az webapp config show --name voice-agent-backend-server --resource-group voice-agent-backend-resource-grp`

3. **Check Python version**: Ensure it's set to 3.10

4. **Verify startup file**: Should be set to `startup.py`
