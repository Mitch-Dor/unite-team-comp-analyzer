#!/usr/bin/env bash
# exit on error
set -o errexit

# Install frontend dependencies and build
cd frontend
echo "Current directory: $(pwd)"
npm ci
npm run build

# Create a directory in the root that will persist
cd ..
mkdir -p public
cp -r frontend/build/* public/

# Install backend dependencies
cd backend
npm ci