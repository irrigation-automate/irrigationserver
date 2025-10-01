#!/bin/bash

# Remove build artifacts
rm -rf dist/
rm -rf build/
rm -f *.tsbuildinfo

# Remove node modules and reinstall
rm -rf node_modules/
npm install

echo "✅ Build artifacts and node modules cleaned successfully"
