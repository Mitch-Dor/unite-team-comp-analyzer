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
# remote: Build directory contents:
# remote: total 48
# remote: drwx------ 3 u19767 dyno 4096 Jun  5 01:07 .
# remote: drwx------ 6 u19767 dyno 4096 Jun  5 01:07 ..
# remote: drwx------ 5 u19767 dyno 4096 Jun  5 01:07 assets
# remote: -rw------- 1 u19767 dyno 3870 Jun  5 01:07 favicon.ico
# remote: -rw------- 1 u19767 dyno 1853 Jun  5 01:07 index.html
# remote: -rw------- 1 u19767 dyno 5347 Jun  5 01:07 logo192.png
# remote: -rw------- 1 u19767 dyno 9664 Jun  5 01:07 logo512.png
# remote: -rw------- 1 u19767 dyno  492 Jun  5 01:07 manifest.json
# remote: -rw------- 1 u19767 dyno   67 Jun  5 01:07 robots.txt

# Create frontend directory in backend if it doesn't exist
cd ../backend
echo "Backend directory: $(pwd)"
echo "Backend contents:"
ls -la
# remote: Backend directory: /app/backend
# remote: Backend contents:
# remote: total 160
# remote: drwx------  6 u19767 dyno   4096 Jun  5 01:06 .
# remote: drwx------ 10 u19767 dyno   4096 Jun  5 01:07 ..
# remote: -rw-------  1 u19767 dyno    310 Jun  5 01:06 .gitignore
# remote: -rw-------  1 u19767 dyno    376 Jun  5 01:06 README.md
# remote: -rw-------  1 u19767 dyno   3920 Jun  5 01:06 app.js
# remote: drwx------  3 u19767 dyno   4096 Jun  5 01:06 database
# remote: -rw-------  1 u19767 dyno   1637 Jun  5 01:06 database.js
# remote: drwx------  4 u19767 dyno   4096 Jun  5 01:06 database_actual
# remote: -rw-------  1 u19767 dyno 118098 Jun  5 01:06 package-lock.json
# remote: -rw-------  1 u19767 dyno    743 Jun  5 01:06 package.json
# remote: drwx------  2 u19767 dyno   4096 Jun  5 01:06 routes
# remote: drwx------  2 u19767 dyno   4096 Jun  5 01:06 socket

mkdir -p frontend
echo "After creating frontend directory:"
ls -la
# remote: After creating frontend directory:
# remote: total 164
# remote: drwx------  7 u19767 dyno   4096 Jun  5 01:07 .
# remote: drwx------ 10 u19767 dyno   4096 Jun  5 01:07 ..
# remote: -rw-------  1 u19767 dyno    310 Jun  5 01:06 .gitignore
# remote: -rw-------  1 u19767 dyno    376 Jun  5 01:06 README.md
# remote: -rw-------  1 u19767 dyno   3920 Jun  5 01:06 app.js
# remote: drwx------  3 u19767 dyno   4096 Jun  5 01:06 database
# remote: -rw-------  1 u19767 dyno   1637 Jun  5 01:06 database.js
# remote: drwx------  4 u19767 dyno   4096 Jun  5 01:06 database_actual
# remote: drwx------  2 u19767 dyno   4096 Jun  5 01:07 frontend
# remote: -rw-------  1 u19767 dyno 118098 Jun  5 01:06 package-lock.json
# remote: -rw-------  1 u19767 dyno    743 Jun  5 01:06 package.json
# remote: drwx------  2 u19767 dyno   4096 Jun  5 01:06 routes
# remote: drwx------  2 u19767 dyno   4096 Jun  5 01:06 socket

# Copy frontend build files to backend/frontend
cp -r ../frontend/build/* frontend/
echo "After copying - Frontend directory contents:"
ls -la frontend
# remote: After copying - Frontend directory contents:
# remote: total 48
# remote: drwx------ 3 u19767 dyno 4096 Jun  5 01:07 .
# remote: drwx------ 7 u19767 dyno 4096 Jun  5 01:07 ..
# remote: drwx------ 5 u19767 dyno 4096 Jun  5 01:07 assets
# remote: -rw------- 1 u19767 dyno 3870 Jun  5 01:07 favicon.ico
# remote: -rw------- 1 u19767 dyno 1853 Jun  5 01:07 index.html
# remote: -rw------- 1 u19767 dyno 5347 Jun  5 01:07 logo192.png
# remote: -rw------- 1 u19767 dyno 9664 Jun  5 01:07 logo512.png
# remote: -rw------- 1 u19767 dyno  492 Jun  5 01:07 manifest.json
# remote: -rw------- 1 u19767 dyno   67 Jun  5 01:07 robots.txt

# Install backend dependencies
npm ci 