#!/usr/bin/env bash
# exit on error
set -o errexit

# Install frontend dependencies and build
cd frontend
npm ci
npm run build

# Create frontend directory in backend if it doesn't exist
cd ../backend
mkdir -p frontend

# Copy frontend build files to backend/frontend
cp -r ../frontend/dist frontend/

# Install backend dependencies
npm ci 