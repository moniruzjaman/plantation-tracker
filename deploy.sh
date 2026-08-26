#!/bin/bash
# Plantation Tracker - Complete Build & Deploy Script
# This script handles the full deployment process

set -e

echo "=== Plantation Tracker Deployment ==="
echo ""

# Phase 1: Environment Setup
echo "Phase 1: Environment Setup"
echo "---------------------------"

# Check Node version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
echo "Node version: $(node --version)"
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "ERROR: Node version must be >= 20"
    exit 1
fi

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << 'EOF'
# === DATABASE (Neon PostgreSQL) ===
POSTGRES_PRISMA_URL="postgresql://dummy:dummy@localhost:5432/plantation"

# GEMINI_API_KEY
GEMINI_API_KEY="dummy-key"

# APP_URL
APP_URL="https://plantation-tracker.vercel.app"

# === Google Earth Engine (GEE) ===
GEE_SERVICE_ACCOUNT_EMAIL="dummy@example.com"
GEE_SERVICE_ACCOUNT_KEY="dummy-key"
GEE_PROJECT_ID="dummy-project"

# === Google Apps Script (GAS) sync ===
GAS_WEBHOOK_URL="https://script.google.com/macros/s/AKfycbxD/exec"

# AUTH_SECRET
AUTH_SECRET="test-secret-key-for-build"
EOF
    echo ".env file created"
else
    echo ".env file already exists"
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
if [ -f package-lock.json ]; then
    npm ci
else
    npm install
fi

# Phase 2: Build
echo ""
echo "Phase 2: Build"
echo "-------------"

# Run the build
echo "Building the application..."
npm run build

# Verify build output
if [ -f build/index.html ]; then
    echo "Build successful! Output in build/"
    ls -la build/
else
    echo "ERROR: Build failed - build/index.html not found"
    exit 1
fi

# Phase 3: Deploy
echo ""
echo "Phase 3: Deploy"
echo "--------------"

# Check if vercel CLI is available
echo "Checking Vercel CLI..."
if ! npx vercel --version 2>/dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "Deploying to Vercel..."
npx vercel --yes --prod

echo ""
echo "=== Deployment Complete ==="
