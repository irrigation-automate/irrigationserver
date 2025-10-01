#!/bin/bash

# =============================================
# Script: clean-build.sh
# Description: Cleans build artifacts and node modules, then performs a fresh install.
#              Use this script to ensure a clean build environment.
#
# Usage:
#   ./scripts/clean-build.sh
#
# Exit Codes:
#   0 - Success
#   1 - Error during execution
# =============================================

set -e  # Exit immediately if a command exits with a non-zero status

echo "🚀 Starting build cleanup..."

# Remove build artifacts
echo "🧹 Removing build artifacts..."
rm -rf dist/
rm -rf build/
rm -f *.tsbuildinfo

# Remove node modules and reinstall
echo "🔄 Reinstalling node modules..."
rm -rf node_modules/
npm install

echo "✅ Build artifacts and node modules cleaned successfully"
echo "✨ Project is ready for a fresh build!"

exit 0
