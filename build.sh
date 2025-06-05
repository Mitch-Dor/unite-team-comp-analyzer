#!/usr/bin/env bash
# exit on error
set -o errexit

# Install frontend dependencies and build
cd frontend
echo "Current directory: $(pwd)"
npm ci
npm run build

# Copy build files to backend/public
cd ../backend
mkdir -p public
cp -r ../frontend/build/* public/

# Install backend dependencies
npm ci