#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la
# remote: Current directory: /app
# remote: Directory contents:
# remote: total 116
# remote: drwx------  9 u41087 dyno  4096 Jun  5 01:02 .
# remote: drwxr-xr-x 11 root   root  4096 Jun  2 16:44 ..
# remote: -rw-------  1 u41087 dyno   315 Jun  5 01:02 .gitignore
# remote: drwx------  4 u41087 dyno  4096 Jun  5 01:02 .heroku
# remote: drwx------  2 u41087 dyno  4096 Jun  5 01:02 .profile.d
# remote: -rw-------  1 u41087 dyno    80 Jun  5 01:02 Procfile
# remote: -rw-------  1 u41087 dyno   968 Jun  5 01:02 README.md
# remote: drwx------  4 u41087 dyno  4096 Jun  5 01:02 analysis
# remote: drwx------  6 u41087 dyno  4096 Jun  5 01:02 backend
# remote: -rwx------  1 u41087 dyno   753 Jun  5 01:02 build.sh
# remote: drwx------  4 u41087 dyno  4096 Jun  5 01:02 frontend
# remote: drwx------  4 u41087 dyno  4096 Jun  5 01:02 frontendMockUps
# remote: drwx------ 55 u41087 dyno  4096 Jun  5 01:02 node_modules
# remote: -rw-------  1 u41087 dyno 59845 Jun  5 01:02 package-lock.json
# remote: -rw-------  1 u41087 dyno   399 Jun  5 01:02 package.json

# Install frontend dependencies and build
cd frontend
echo "Frontend directory: $(pwd)"
echo "Frontend contents:"
ls -la
# remote: Frontend directory: /app/frontend
# remote: Frontend contents:
# remote: total 184
# remote: drwx------ 4 u41087 dyno   4096 Jun  5 01:02 .
# remote: drwx------ 9 u41087 dyno   4096 Jun  5 01:02 ..
# remote: -rw------- 1 u41087 dyno    310 Jun  5 01:02 .gitignore
# remote: -rw------- 1 u41087 dyno   1756 Jun  5 01:02 index.html
# remote: -rw------- 1 u41087 dyno 154374 Jun  5 01:02 package-lock.json
# remote: -rw------- 1 u41087 dyno   1217 Jun  5 01:02 package.json
# remote: drwx------ 3 u41087 dyno   4096 Jun  5 01:02 public
# remote: drwx------ 5 u41087 dyno   4096 Jun  5 01:02 src
# remote: -rw------- 1 u41087 dyno    543 Jun  5 01:02 vite.config.js

npm ci
npm run build

echo "After build - Frontend contents:"
ls -la
# remote: After build - Frontend contents:
# remote: total 200
# remote: drwx------  6 u41087 dyno   4096 Jun  5 01:02 .
# remote: drwx------ 10 u41087 dyno   4096 Jun  5 01:02 ..
# remote: -rw-------  1 u41087 dyno    310 Jun  5 01:02 .gitignore
# remote: drwx------  3 u41087 dyno   4096 Jun  5 01:02 build
# remote: -rw-------  1 u41087 dyno   1756 Jun  5 01:02 index.html
# remote: drwx------ 81 u41087 dyno  12288 Jun  5 01:02 node_modules
# remote: -rw-------  1 u41087 dyno 154374 Jun  5 01:02 package-lock.json
# remote: -rw-------  1 u41087 dyno   1217 Jun  5 01:02 package.json
# remote: drwx------  3 u41087 dyno   4096 Jun  5 01:02 public
# remote: drwx------  5 u41087 dyno   4096 Jun  5 01:02 src
# remote: -rw-------  1 u41087 dyno    543 Jun  5 01:02 vite.config.js
echo "Build directory contents:"
ls -la build

# Create frontend directory in backend if it doesn't exist
cd ../backend
echo "Backend directory: $(pwd)"
echo "Backend contents:"
ls -la

mkdir -p frontend
echo "After creating frontend directory:"
ls -la

# Copy frontend build files to backend/frontend
cp -r ../frontend/build/* frontend/
echo "After copying - Frontend directory contents:"
ls -la frontend

# Install backend dependencies
npm ci 