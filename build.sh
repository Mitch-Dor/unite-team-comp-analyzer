#!/usr/bin/env bash
# exit on error
set -o errexit

# Install frontend dependencies and build
cd frontend
echo "Current directory: $(pwd)"
npm ci
npm run build

# Verify build directory exists and contains index.html
echo "Checking build directory contents:"
ls -la build
if [ ! -f "build/index.html" ]; then
    echo "ERROR: build/index.html not found"
    exit 1
fi

# Install backend dependencies
cd ../backend
npm ci