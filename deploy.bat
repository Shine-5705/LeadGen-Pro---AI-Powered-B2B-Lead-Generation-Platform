@echo off
echo 🚀 Starting deployment process...

REM Build the React app
echo 📦 Building React frontend...
cd client
call npm run build
cd ..

echo ✅ Frontend build complete!

REM Install server dependencies
echo 📦 Installing server dependencies...
cd server
call npm install --production
cd ..

echo ✅ Server dependencies installed!

echo 🎉 Deployment preparation complete!
echo Your app is ready to deploy!

REM Instructions
echo.
echo 📋 Next steps:
echo 1. For Vercel: Run 'vercel' in the root directory
echo 2. For Railway: Connect your GitHub repo to Railway
echo 3. For Render: Connect your GitHub repo to Render
echo 4. For Docker: Run 'docker build -t leadgen-app .'

pause