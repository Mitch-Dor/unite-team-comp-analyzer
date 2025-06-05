#!/usr/bin/env bash
# exit on error
set -o errexit

# Install frontend dependencies and build
cd frontend
npm install
npm run build

# Install backend dependencies
cd ../backend
npm install 