@echo off
title Full Stack API Integration
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao foi encontrado no computador.
  echo Instale o Node.js em https://nodejs.org/ e tente novamente.
  pause
  exit /b 1
)

start "" "http://localhost:3000"
node server.js
pause
