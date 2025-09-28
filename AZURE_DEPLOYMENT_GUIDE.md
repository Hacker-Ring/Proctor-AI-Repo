# 🚀 Azure Web App Deployment Guide

## 📋 **Your Azure Web App Details:**

- **Name**: `voice-agent-backend-server`
- **Resource Group**: `voice-agent-backend-resource-grp`
- **URL**: `https://voice-agent-backend-server-bsbvhshfgagsf4d4.eastus-01.azurewebsites.net`
- **Status**: Running ✅

## 🎯 **Deployment Methods:**

### **Method 1: Azure Portal (Recommended)**

1. **Go to Azure Portal**: https://portal.azure.com
2. **Navigate to**: App Services → voice-agent-backend-server
3. **Click**: "Deployment Center" in the left menu
4. **Choose**: "Local Git" or "Zip Deploy"
5. **Upload**: The `voice-agent-backend.zip` file we created
6. **Wait**: For deployment to complete (2-5 minutes)

### **Method 2: Azure CLI (Command Line)**

```bash
# Navigate to your project directory
cd /Users/gnani/Desktop/spam/hacker-ring-RVIT/Proctor-AI-Repo

# Deploy using Azure CLI
az webapp deployment source config-zip \
    --resource-group voice-agent-backend-resource-grp \
    --name voice-agent-backend-server \
    --src voice-agent-backend.zip
```

### **Method 3: FTP Deployment**

1. **Get FTP credentials**:

```bash
az webapp deployment list-publishing-credentials \
    --resource-group voice-agent-backend-resource-grp \
    --name voice-agent-backend-server
```

2. **Use FTP client** to upload files to `/site/wwwroot/`

## ⚙️ **Environment Variables Setup:**

After deployment, you need to configure environment variables in Azure:

### **Via Azure Portal:**

1. Go to your Web App
2. Click "Configuration" in the left menu
3. Add these environment variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://pgwisrxochxwpimipjxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key

# Azure Voice Live API Configuration
AZURE_VOICE_LIVE_ENDPOINT=https://voice-agent-resource.cognitiveservices.azure.com/
AZURE_VOICE_LIVE_API_VERSION=yw
AZURE_VOICE_LIVE_API_KEY=your_azure_voice_api_key

# Azure OpenAI WebSocket Configuration
AZURE_OPENAI_WEBSOCKET_ENDPOINT=wss://upend-m84cg8b3-eastus2.cognitiveservices.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2025-01-01-preview
AZURE_OPENAI_WEBSOCKET_API_KEY=your_azure_openai_api_key

# AI Foundry Configuration
AI_FOUNDRY_PROJECT_NAME=proctorai
AI_FOUNDRY_AGENT_ID=asst_eahsCqeN0OUpxIWlTpHhrL3c

# Twilio Configuration (Add your actual Twilio credentials)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# RAG Configuration
RAG_ENDPOINT=https://rag-function-app-1758997681.azurewebsites.net/api/rag?action=rag_query
```

### **Via Azure CLI:**

```bash
# Set environment variables
az webapp config appsettings set \
    --resource-group voice-agent-backend-resource-grp \
    --name voice-agent-backend-server \
    --settings \
        NEXT_PUBLIC_SUPABASE_URL="https://pgwisrxochxwpimipjxx.supabase.co" \
        NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key" \
        SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_key" \
        AZURE_VOICE_LIVE_ENDPOINT="https://voice-agent-resource.cognitiveservices.azure.com/" \
        AZURE_VOICE_LIVE_API_KEY="your_azure_voice_api_key" \
        AZURE_OPENAI_WEBSOCKET_ENDPOINT="wss://upend-m84cg8b3-eastus2.cognitiveservices.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2025-01-01-preview" \
        AZURE_OPENAI_WEBSOCKET_API_KEY="your_azure_openai_api_key" \
        AI_FOUNDRY_PROJECT_NAME="proctorai" \
        AI_FOUNDRY_AGENT_ID="asst_eahsCqeN0OUpxIWlTpHhrL3c" \
        RAG_ENDPOINT="https://rag-function-app-1758997681.azurewebsites.net/api/rag?action=rag_query"
```

## 🔍 **Testing Deployment:**

After deployment and environment setup:

### **1. Health Check:**

```bash
curl https://voice-agent-backend-server-bsbvhshfgagsf4d4.eastus-01.azurewebsites.net/health
```

### **2. Test Endpoints:**

```bash
# Test incoming call webhook
curl -X POST "https://voice-agent-backend-server-bsbvhshfgagsf4d4.eastus-01.azurewebsites.net/incoming-call" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "CallSid=CA1234567890abcdef&From=%2B1234567890&To=%2B1234567890&CallStatus=ringing&Direction=inbound"

# Test active sessions
curl https://voice-agent-backend-server-bsbvhshfgagsf4d4.eastus-01.azurewebsites.net/active-sessions
```

## 📊 **Monitoring:**

### **View Logs:**

```bash
az webapp log tail \
    --resource-group voice-agent-backend-resource-grp \
    --name voice-agent-backend-server
```

### **Check Status:**

```bash
az webapp show \
    --resource-group voice-agent-backend-resource-grp \
    --name voice-agent-backend-server \
    --query "{Name:name, State:state, DefaultHostName:defaultHostName}"
```

## 🎯 **Next Steps:**

1. **Deploy** using one of the methods above
2. **Configure** environment variables
3. **Test** the endpoints
4. **Update** Twilio webhook URL to point to your Azure Web App
5. **Monitor** logs for any issues

## 🚀 **Ready for Production!**

Your voice agent backend is ready to be deployed to Azure Web App! 🎉
