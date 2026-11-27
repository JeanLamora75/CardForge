@echo off
setlocal
cd /d "%~dp0"
title CardForge - Test production
where node >nul 2>&1
if errorlevel 1 goto :missing
where npm >nul 2>&1
if errorlevel 1 goto :missing
node scripts/start-mobile.mjs
if errorlevel 1 goto :failed
exit /b 0
:missing
echo Node.js et npm doivent etre accessibles dans PATH.
pause
exit /b 1
:failed
echo Une erreur a interrompu le lancement de CardForge. Consultez le journal ci-dessus.
pause
exit /b 1
