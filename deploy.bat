@echo off
echo.
echo ========================================
echo    3D Portfolio Game - GitHub Deploy
echo ========================================
echo.

REM Check if git is configured
git config user.name >nul 2>&1
if errorlevel 1 (
    echo Setting up git configuration...
    set /p username="Enter your GitHub username: "
    set /p email="Enter your GitHub email: "
    git config --global user.name "!username!"
    git config --global user.email "!email!"
)

echo Current git status:
git status --short
echo.

REM Check if remote exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo No remote repository found.
    echo.
    echo INSTRUCTIONS:
    echo 1. Go to https://github.com/new
    echo 2. Create a repository named "3d-portfolio-game"
    echo 3. DO NOT initialize with README, .gitignore, or license
    echo 4. Copy the repository URL and run this command:
    echo    git remote add origin https://github.com/YOUR-USERNAME/3d-portfolio-game.git
    echo 5. Run this script again
    echo.
    pause
    exit /b 1
)

echo Pushing to GitHub...
git add .
git commit -m "Update portfolio game - %date% %time%"
git push -u origin main

echo.
echo ========================================
echo    DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your 3D portfolio game is now live at:

REM Extract username from remote URL
for /f "tokens=2 delims=/" %%i in ('git remote get-url origin') do set github_user=%%i
for /f "tokens=1 delims=." %%i in ('echo %github_user%') do set clean_user=%%i

echo https://%clean_user%.github.io/3d-portfolio-game/
echo.
echo NOTE: It may take a few minutes for GitHub Pages to deploy.
echo If the link doesn't work immediately, wait 5-10 minutes and try again.
echo.
echo To enable GitHub Pages:
echo 1. Go to your repository on GitHub
echo 2. Click Settings
echo 3. Scroll to "Pages" section
echo 4. Select "Deploy from a branch"
echo 5. Choose "main" branch and "/ (root)" folder
echo 6. Save
echo.
pause
