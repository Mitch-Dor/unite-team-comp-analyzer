#!/usr/bin/env bash
# exit on error
set -o errexit

# Install frontend dependencies and build
cd frontend
echo "Current directory: $(pwd)"
npm ci
npm run build

# Install backend dependencies
cd ../backend
npm ci