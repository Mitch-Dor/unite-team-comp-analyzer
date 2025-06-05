#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Install frontend dependencies and build
cd frontend
echo "Frontend directory: $(pwd)"
echo "Frontend contents:"
ls -la

npm ci
npm run build

echo "After build - Frontend contents:"
ls -la
echo "Dist directory contents:"
ls -la dist

# Create frontend directory in backend if it doesn't exist
cd ../backend
echo "Backend directory: $(pwd)"
echo "Backend contents:"
ls -la

mkdir -p frontend
echo "After creating frontend directory:"
ls -la

# Copy frontend build files to backend/frontend
cp -r ../frontend/dist/* frontend/
echo "After copying - Frontend directory contents:"
ls -la frontend

# Install backend dependencies
npm ci 