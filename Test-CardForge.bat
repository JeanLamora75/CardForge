@echo off
setlocal
cd /d "%~dp0"
title CardForge - Test production
where node >nul 2>&1
if errorlevel 1 goto :missing
where npm >nul 2>&1
if errorlevel 1 goto :missing
echo [1/3] Installation des dependances...
call npm install
if errorlevel 1 goto :failed
echo [2/3] Compilation de production...
call npm run build
if errorlevel 1 goto :failed
echo [3/3] Verification PWA et lancement du navigateur...
call npm run verify:pwa
if errorlevel 1 goto :failed
node scripts/preview-mobile.mjs
if errorlevel 1 goto :failed
exit /b 0
:missing
echo Node.js et npm doivent etre accessibles dans PATH.
pause
exit /b 1
:failed
echo Une erreur a interrompu le lancement de CardForge.
pause
exit /b 1
