#!/bin/bash

# ByDefault Documentation Deployment Script
# This script helps deploy the documentation to various hosting platforms

set -e

echo "🚀 ByDefault Documentation Deployment Script"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the docs directory."
    exit 1
fi

# Function to deploy to GitHub Pages
deploy_github_pages() {
    echo "📦 Deploying to GitHub Pages..."
    
    # Check if git is available
    if ! command -v git &> /dev/null; then
        echo "❌ Git is not installed or not in PATH"
        exit 1
    fi
    
    # Create a temporary directory for deployment
    TEMP_DIR=$(mktemp -d)
    echo "📁 Created temporary directory: $TEMP_DIR"
    
    # Copy files to temp directory
    cp -r . "$TEMP_DIR/"
    cd "$TEMP_DIR"
    
    # Initialize git repository
    git init
    git add .
    git commit -m "Deploy documentation $(date)"
    
    # Add GitHub Pages remote (you'll need to update this with your actual repo)
    echo "🔗 Please update the repository URL in this script"
    # git remote add origin https://github.com/yourusername/yourrepo.git
    # git push -f origin main:gh-pages
    
    echo "✅ GitHub Pages deployment prepared. Please update the repository URL and run the git commands."
}

# Function to deploy to Netlify
deploy_netlify() {
    echo "📦 Preparing for Netlify deployment..."
    
    # Check if Netlify CLI is installed
    if ! command -v netlify &> /dev/null; then
        echo "❌ Netlify CLI is not installed. Please install it first:"
        echo "   npm install -g netlify-cli"
        exit 1
    fi
    
    # Deploy to Netlify
    netlify deploy --prod --dir .
    
    echo "✅ Deployed to Netlify!"
}

# Function to deploy to Vercel
deploy_vercel() {
    echo "📦 Preparing for Vercel deployment..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo "❌ Vercel CLI is not installed. Please install it first:"
        echo "   npm install -g vercel"
        exit 1
    fi
    
    # Deploy to Vercel
    vercel --prod
    
    echo "✅ Deployed to Vercel!"
}

# Function to create a zip file for manual deployment
create_deployment_package() {
    echo "📦 Creating deployment package..."
    
    ZIP_NAME="byddefault-docs-$(date +%Y%m%d-%H%M%S).zip"
    
    # Create zip file excluding unnecessary files
    zip -r "$ZIP_NAME" . -x "*.git*" "*.DS_Store" "deploy.sh" "README.md" "*.md"
    
    echo "✅ Created deployment package: $ZIP_NAME"
    echo "📁 You can upload this file to any static hosting service"
}

# Main menu
echo ""
echo "Select deployment option:"
echo "1) GitHub Pages"
echo "2) Netlify"
echo "3) Vercel"
echo "4) Create deployment package (ZIP)"
echo "5) Exit"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        deploy_github_pages
        ;;
    2)
        deploy_netlify
        ;;
    3)
        deploy_vercel
        ;;
    4)
        create_deployment_package
        ;;
    5)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
echo "📖 Documentation is now available online"
