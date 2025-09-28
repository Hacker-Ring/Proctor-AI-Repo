#!/bin/bash

# Azure Web App Deployment Script
# This script deploys the FastAPI backend to Azure Web App

echo "🚀 Starting Azure Web App Deployment..."
echo "======================================"

# Set variables
AZURE_WEBAPP_NAME="voice-agent-backend-server"
AZURE_RESOURCE_GROUP="voice-agent-backend-resource-grp"
AZURE_LOCATION="eastus-01"

echo "📋 Deployment Configuration:"
echo "   - Web App Name: $AZURE_WEBAPP_NAME"
echo "   - Resource Group: $AZURE_RESOURCE_GROUP"
echo "   - Location: $AZURE_LOCATION"
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first:"
    echo "   https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged in to Azure
echo "🔐 Checking Azure CLI authentication..."
if ! az account show &> /dev/null; then
    echo "❌ Not logged in to Azure. Please run: az login"
    exit 1
fi

echo "✅ Azure CLI authenticated"

# Create deployment package
echo "📦 Creating deployment package..."
cd backend

# Create a temporary directory for deployment
mkdir -p ../deployment-temp
cp -r . ../deployment-temp/
cd ../deployment-temp

# Remove unnecessary files
rm -rf venv/
rm -rf __pycache__/
rm -rf services/__pycache__/
rm -rf *.pyc
rm -rf .env
rm -rf server.log

# Create deployment zip
echo "📦 Creating deployment zip..."
zip -r ../deployment-package.zip . -x "*.pyc" "__pycache__/*" "venv/*" ".env" "server.log"

echo "✅ Deployment package created"

# Deploy to Azure Web App
echo "🚀 Deploying to Azure Web App..."

# Configure the web app for Python
echo "⚙️ Configuring web app for Python..."
az webapp config set \
    --resource-group $AZURE_RESOURCE_GROUP \
    --name $AZURE_WEBAPP_NAME \
    --python-version 3.10

# Set startup command
echo "⚙️ Setting startup command..."
az webapp config set \
    --resource-group $AZURE_RESOURCE_GROUP \
    --name $AZURE_WEBAPP_NAME \
    --startup-file "startup.py"

# Enable build during deployment
echo "⚙️ Enabling build during deployment..."
az webapp config appsettings set \
    --resource-group $AZURE_RESOURCE_GROUP \
    --name $AZURE_WEBAPP_NAME \
    --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true

# Deploy the zip file
echo "📤 Uploading files to Azure Web App..."
az webapp deployment source config-zip \
    --resource-group $AZURE_RESOURCE_GROUP \
    --name $AZURE_WEBAPP_NAME \
    --src ../deployment-package.zip

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo ""
    echo "🌐 Your app is available at:"
    echo "   https://$AZURE_WEBAPP_NAME.azurewebsites.net"
    echo ""
    echo "📊 Check deployment status:"
    echo "   az webapp show --name $AZURE_WEBAPP_NAME --resource-group $AZURE_RESOURCE_GROUP"
    echo ""
    echo "📝 View logs:"
    echo "   az webapp log tail --name $AZURE_WEBAPP_NAME --resource-group $AZURE_RESOURCE_GROUP"
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi

# Cleanup
cd ..
rm -rf deployment-temp
rm -f deployment-package.zip

echo "🎉 Deployment process completed!"
