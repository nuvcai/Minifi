#!/bin/bash
# MiniFi Frontend Deployment Script
# Run this in your terminal: ./deploy_frontend.sh

set -e

echo "🌐 MiniFi Frontend Deployment (Vercel)"
echo "======================================="
echo ""

# Navigate to project root
cd "$(dirname "$0")"

echo "📁 Current directory: $(pwd)"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Get backend URL from user
echo "🔗 Enter your backend URL (from Railway/Render deployment):"
echo "   Example: https://minifi-backend-production.up.railway.app"
read -p "   Backend URL: " BACKEND_URL

# Validate URL
if [[ -z "$BACKEND_URL" ]]; then
    echo "❌ Backend URL cannot be empty!"
    exit 1
fi

# Login to Vercel (if needed)
echo ""
echo "🔐 Logging into Vercel..."
vercel login

# Deploy to Vercel with environment variable
echo ""
echo "🚀 Deploying to Vercel..."
vercel --prod --yes -e NEXT_PUBLIC_API_URL="$BACKEND_URL"

echo ""
echo "✅ Frontend deployment complete!"
echo ""
echo "🎉 Your MiniFi app is now live!"
echo ""
echo "📋 Next steps:"
echo "   1. Visit your Vercel URL to test the app"
echo "   2. Test the AI coach functionality"
echo "   3. Verify trading simulation works"
echo ""


