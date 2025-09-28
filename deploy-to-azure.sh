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
mkdir -p ../deployment-package
cp -r . ../deployment-package/
cd ../deployment-package

# Remove unnecessary files
rm -rf venv/
rm -rf __pycache__/
rm -rf *.pyc
rm -rf .env
rm -rf server.log

echo "✅ Deployment package created"

# Deploy to Azure Web App
echo "🚀 Deploying to Azure Web App..."

# Method 1: Using Azure CLI (if you have the web app configured)
echo "📤 Uploading files to Azure Web App..."
az webapp deployment source config-zip \
    --resource-group $AZURE_RESOURCE_GROUP \
    --name $AZURE_WEBAPP_NAME \
    --src deployment-package.zip

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
rm -rf deployment-package

echo "🎉 Deployment process completed!"
