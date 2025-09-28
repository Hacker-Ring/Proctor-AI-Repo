#!/bin/bash

# Azure CLI Deployment Script for FastAPI Voice Agent Backend
# This script handles the complete deployment process using Azure CLI

set -e  # Exit on any error

echo "🚀 Azure CLI Deployment for Voice Agent Backend"
echo "=============================================="

# Configuration Variables
AZURE_WEBAPP_NAME="voice-agent-backend-server"
AZURE_RESOURCE_GROUP="voice-agent-backend-resource-grp"
AZURE_LOCATION="eastus"
AZURE_APP_SERVICE_PLAN="voice-agent-plan"
AZURE_SUBSCRIPTION_ID=""  # Set this if you have multiple subscriptions

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if Azure CLI is installed
    if ! command -v az &> /dev/null; then
        print_error "Azure CLI is not installed. Please install it first:"
        echo "   https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
        exit 1
    fi
    
    # Check if logged in to Azure
    if ! az account show &> /dev/null; then
        print_error "Not logged in to Azure. Please run: az login"
        exit 1
    fi
    
    # Check if zip command is available
    if ! command -v zip &> /dev/null; then
        print_error "zip command is not available. Please install zip utility."
        exit 1
    fi
    
    print_success "All prerequisites met"
}

# Set Azure subscription if specified
set_subscription() {
    if [ ! -z "$AZURE_SUBSCRIPTION_ID" ]; then
        print_status "Setting Azure subscription to: $AZURE_SUBSCRIPTION_ID"
        az account set --subscription "$AZURE_SUBSCRIPTION_ID"
        print_success "Subscription set successfully"
    fi
}

# Create resource group if it doesn't exist
create_resource_group() {
    print_status "Checking resource group: $AZURE_RESOURCE_GROUP"
    
    if az group show --name "$AZURE_RESOURCE_GROUP" &> /dev/null; then
        print_success "Resource group already exists"
    else
        print_status "Creating resource group: $AZURE_RESOURCE_GROUP"
        az group create \
            --name "$AZURE_RESOURCE_GROUP" \
            --location "$AZURE_LOCATION"
        print_success "Resource group created successfully"
    fi
}

# Create App Service Plan if it doesn't exist
create_app_service_plan() {
    print_status "Checking App Service Plan: $AZURE_APP_SERVICE_PLAN"
    
    if az appservice plan show --name "$AZURE_APP_SERVICE_PLAN" --resource-group "$AZURE_RESOURCE_GROUP" &> /dev/null; then
        print_success "App Service Plan already exists"
    else
        print_status "Creating App Service Plan: $AZURE_APP_SERVICE_PLAN"
        az appservice plan create \
            --name "$AZURE_APP_SERVICE_PLAN" \
            --resource-group "$AZURE_RESOURCE_GROUP" \
            --location "$AZURE_LOCATION" \
            --sku B1 \
            --is-linux
        print_success "App Service Plan created successfully"
    fi
}

# Create Web App if it doesn't exist
create_web_app() {
    print_status "Checking Web App: $AZURE_WEBAPP_NAME"
    
    if az webapp show --name "$AZURE_WEBAPP_NAME" --resource-group "$AZURE_RESOURCE_GROUP" &> /dev/null; then
        print_success "Web App already exists"
    else
        print_status "Creating Web App: $AZURE_WEBAPP_NAME"
        az webapp create \
            --name "$AZURE_WEBAPP_NAME" \
            --resource-group "$AZURE_RESOURCE_GROUP" \
            --plan "$AZURE_APP_SERVICE_PLAN" \
            --runtime "PYTHON|3.10"
        print_success "Web App created successfully"
    fi
}

# Configure Web App settings
configure_web_app() {
    print_status "Configuring Web App settings..."
    
    # Set Python version
    az webapp config set \
        --name "$AZURE_WEBAPP_NAME" \
        --resource-group "$AZURE_RESOURCE_GROUP" \
        --python-version 3.10
    
    # Set startup command
    az webapp config set \
        --name "$AZURE_WEBAPP_NAME" \
        --resource-group "$AZURE_RESOURCE_GROUP" \
        --startup-file "startup.py"
    
    # Configure app settings
    az webapp config appsettings set \
        --name "$AZURE_WEBAPP_NAME" \
        --resource-group "$AZURE_RESOURCE_GROUP" \
        --settings \
            SCM_DO_BUILD_DURING_DEPLOYMENT=true \
            WEBSITES_ENABLE_APP_SERVICE_STORAGE=false \
            WEBSITES_CONTAINER_START_TIME_LIMIT=1800 \
            WEBSITES_PORT=8000 \
            PYTHONPATH=/home/site/wwwroot \
            PYTHONUNBUFFERED=1 \
            WEBSITES_LOG_FILE_ENABLED=1 \
            WEBSITES_LOG_FILE_SIZE_LIMIT=35
    
    print_success "Web App configured successfully"
}

# Create deployment package
create_deployment_package() {
    print_status "Creating deployment package..."
    
    # Navigate to backend directory
    cd backend
    
    # Create temporary deployment directory
    DEPLOY_DIR="../deployment-temp"
    mkdir -p "$DEPLOY_DIR"
    
    # Copy files to deployment directory
    cp -r . "$DEPLOY_DIR/"
    cd "$DEPLOY_DIR"
    
    # Remove unnecessary files
    rm -rf venv/
    rm -rf __pycache__/
    rm -rf services/__pycache__/
    rm -rf *.pyc
    rm -rf .env
    rm -rf server.log
    rm -rf *.log
    
    # Create deployment zip
    DEPLOYMENT_ZIP="../deployment-package.zip"
    zip -r "$DEPLOYMENT_ZIP" . -x "*.pyc" "__pycache__/*" "venv/*" ".env" "server.log" "*.log"
    
    print_success "Deployment package created: $DEPLOYMENT_ZIP"
}

# Deploy to Azure
deploy_to_azure() {
    print_status "Deploying to Azure Web App..."
    
    DEPLOYMENT_ZIP="../deployment-package.zip"
    
    # Deploy using zip deployment
    az webapp deployment source config-zip \
        --name "$AZURE_WEBAPP_NAME" \
        --resource-group "$AZURE_RESOURCE_GROUP" \
        --src "$DEPLOYMENT_ZIP"
    
    if [ $? -eq 0 ]; then
        print_success "Deployment completed successfully!"
    else
        print_error "Deployment failed!"
        exit 1
    fi
}

# Verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Get the web app URL
    WEBAPP_URL="https://$AZURE_WEBAPP_NAME.azurewebsites.net"
    
    print_status "Waiting for application to start..."
    sleep 30
    
    # Check if the application is responding
    if curl -f -s "$WEBAPP_URL/health" > /dev/null; then
        print_success "Application is responding at: $WEBAPP_URL"
    else
        print_warning "Application may still be starting. Check logs for details."
    fi
    
    echo ""
    print_success "Deployment completed!"
    echo "🌐 Application URL: $WEBAPP_URL"
    echo "📊 Health Check: $WEBAPP_URL/health"
    echo ""
    echo "📝 Useful commands:"
    echo "   View logs: az webapp log tail --name $AZURE_WEBAPP_NAME --resource-group $AZURE_RESOURCE_GROUP"
    echo "   Check status: az webapp show --name $AZURE_WEBAPP_NAME --resource-group $AZURE_RESOURCE_GROUP"
    echo "   Restart app: az webapp restart --name $AZURE_WEBAPP_NAME --resource-group $AZURE_RESOURCE_GROUP"
}

# Cleanup
cleanup() {
    print_status "Cleaning up temporary files..."
    cd ..
    rm -rf deployment-temp
    rm -f deployment-package.zip
    print_success "Cleanup completed"
}

# Main deployment function
main() {
    echo ""
    print_status "Starting deployment process..."
    echo ""
    
    check_prerequisites
    set_subscription
    create_resource_group
    create_app_service_plan
    create_web_app
    configure_web_app
    create_deployment_package
    deploy_to_azure
    verify_deployment
    cleanup
    
    echo ""
    print_success "🎉 Deployment process completed successfully!"
}

# Run main function
main "$@"
