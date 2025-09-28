# Azure CLI Deployment Instructions

## Option 1: Quick Deployment (Recommended)

Run the quick deployment script:

```bash
./quick-deploy.sh
```

## Option 2: Full Deployment Script

Run the comprehensive deployment script:

```bash
./deploy-azure-cli.sh
```

## Option 3: Manual Step-by-Step Deployment

If you prefer to run commands manually, follow these steps:

### 1. Login to Azure

```bash
az login
```

### 2. Set Subscription (if you have multiple)

```bash
az account set --subscription "your-subscription-id"
```

### 3. Create Resource Group

```bash
az group create \
    --name voice-agent-backend-resource-grp \
    --location eastus
```

### 4. Create App Service Plan

```bash
az appservice plan create \
    --name voice-agent-plan \
    --resource-group voice-agent-backend-resource-grp \
    --location eastus \
    --sku B1 \
    --is-linux
```

### 5. Create Web App

```bash
az webapp create \
    --name voice-agent-backend-server \
    --resource-group voice-agent-backend-resource-grp \
    --plan voice-agent-plan \
    --runtime "PYTHON|3.10"
```

### 6. Configure Web App

```bash
# Set startup file
az webapp config set \
    --name voice-agent-backend-server \
    --resource-group voice-agent-backend-resource-grp \
    --startup-file "startup.py"

# Enable build during deployment
az webapp config appsettings set \
    --name voice-agent-backend-server \
    --resource-group voice-agent-backend-resource-grp \
    --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

### 7. Create Deployment Package

```bash
cd backend
zip -r ../deployment.zip . -x "venv/*" "__pycache__/*" "*.pyc" ".env" "server.log"
```

### 8. Deploy Application

```bash
az webapp deployment source config-zip \
    --name voice-agent-backend-server \
    --resource-group voice-agent-backend-resource-grp \
    --src ../deployment.zip
```

### 9. Verify Deployment

```bash
# Check if app is running
curl https://voice-agent-backend-server.azurewebsites.net/health

# View logs
az webapp log tail \
    --name voice-agent-backend-server \
    --resource-group voice-agent-backend-resource-grp
```

## Troubleshooting Commands

### Check Web App Status

```bash
az webapp show \
    --name voice-agent-backend-server \
    --resource-group voice-agent-backend-resource-grp
```

### View Application Settings

```bash
az webapp config appsettings list \
    --name voice-agent-backend-server \
    --resource-group voice-agent-backend-resource-grp
```

### Restart Application

```bash
az webapp restart \
    --name voice-agent-backend-server \
    --resource-group voice-agent-backend-resource-grp
```

### View Logs

```bash
az webapp log tail \
    --name voice-agent-backend-server \
    --resource-group voice-agent-backend-resource-grp
```

### Download Logs

```bash
az webapp log download \
    --name voice-agent-backend-server \
    --resource-group voice-agent-backend-resource-grp
```

## Expected Results

After successful deployment:

- ✅ Web App created and configured
- ✅ Python dependencies installed automatically
- ✅ Application starts without errors
- ✅ Health endpoint responds: `https://voice-agent-backend-server.azurewebsites.net/health`
- ✅ Main application available at: `https://voice-agent-backend-server.azurewebsites.net`

## Cost Information

The deployment uses:

- **App Service Plan**: B1 tier (~$13/month)
- **Resource Group**: Free
- **Web App**: Included in App Service Plan

Total estimated cost: ~$13/month

## Next Steps

1. **Set Environment Variables**: Configure your API keys and secrets in Azure App Settings
2. **Configure Custom Domain**: If needed, add a custom domain
3. **Set up Monitoring**: Enable Application Insights for monitoring
4. **Configure SSL**: Ensure HTTPS is enabled (usually automatic)

## Environment Variables Setup

After deployment, set your environment variables:

```bash
az webapp config appsettings set \
    --name voice-agent-backend-server \
    --resource-group voice-agent-backend-resource-grp \
    --settings \
        OPENAI_API_KEY="your-openai-key" \
        TWILIO_ACCOUNT_SID="your-twilio-sid" \
        TWILIO_AUTH_TOKEN="your-twilio-token" \
        SUPABASE_URL="your-supabase-url" \
        SUPABASE_KEY="your-supabase-key"
```
