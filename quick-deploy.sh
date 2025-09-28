#!/bin/bash

# Quick Azure CLI Deployment Script
# Run this script to deploy your FastAPI backend to Azure

echo "🚀 Quick Azure Deployment"
echo "======================="

# Configuration
WEBAPP_NAME="voice-agent-backend-server"
RESOURCE_GROUP="voice-agent-backend-resource-grp"
LOCATION="eastus"
PLAN_NAME="voice-agent-plan"

echo "📋 Configuration:"
echo "   Web App: $WEBAPP_NAME"
echo "   Resource Group: $RESOURCE_GROUP"
echo "   Location: $LOCATION"
echo ""

# Check if logged in
if ! az account show &> /dev/null; then
    echo "❌ Please login to Azure first: az login"
    exit 1
fi

echo "✅ Azure CLI authenticated"

# Create resource group
echo "📦 Creating resource group..."
az group create --name "$RESOURCE_GROUP" --location "$LOCATION" --output none

# Create App Service Plan
echo "📦 Creating App Service Plan..."
az appservice plan create \
    --name "$PLAN_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --location "$LOCATION" \
    --sku B1 \
    --is-linux \
    --output none

# Create Web App
echo "📦 Creating Web App..."
az webapp create \
    --name "$WEBAPP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --plan "$PLAN_NAME" \
    --runtime "PYTHON|3.10" \
    --output none

# Configure Web App
echo "⚙️ Configuring Web App..."
az webapp config set \
    --name "$WEBAPP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --startup-file "startup.py" \
    --output none

az webapp config appsettings set \
    --name "$WEBAPP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true \
    --output none

# Create deployment package
echo "📦 Creating deployment package..."
cd backend
zip -r ../deploy.zip . -x "venv/*" "__pycache__/*" "*.pyc" ".env" "server.log"

# Deploy
echo "🚀 Deploying to Azure..."
az webapp deployment source config-zip \
    --name "$WEBAPP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --src ../deploy.zip \
    --output none

# Cleanup
rm ../deploy.zip
cd ..

echo ""
echo "✅ Deployment completed!"
echo "🌐 Your app: https://$WEBAPP_NAME.azurewebsites.net"
echo "📊 Health check: https://$WEBAPP_NAME.azurewebsites.net/health"
echo ""
echo "📝 View logs: az webapp log tail --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP"
