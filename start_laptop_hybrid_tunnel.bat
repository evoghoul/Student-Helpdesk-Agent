@echo off
title Agent 65 - Laptop Hybrid Ollama Tunnel
color 0A

echo ========================================================
echo   AGENT 65: LAPTOP HYBRID OLLAMA TUNNEL LAUNCHER
echo ========================================================
echo.
echo [1/2] Checking if local Ollama daemon is running...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   [OK] Ollama is already active on port 11434.
) else (
    echo   [..] Starting Ollama in background...
    start /B ollama serve >nul 2>&1
    timeout /t 3 /nobreak >nul
)

echo.
echo [2/2] Checking Cloudflare Tunnel (cloudflared)...
where cloudflared >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo   [!] 'cloudflared' was not found in your PATH.
    echo   You can download it in 10 seconds from:
    echo   https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe
    echo   Rename it to 'cloudflared.exe' and put it in this folder.
    echo.
    echo   Alternative: If you have ngrok installed:
    echo   ngrok http 11434
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================================
echo   STARTING CLOUDFLARE TUNNEL FOR OLLAMA (PORT 11434)
echo ========================================================
echo Copy the *.trycloudflare.com URL below into your Render
echo environment variable: LOCAL_MODEL_URL
echo.
echo Press Ctrl+C anytime to stop.
echo ========================================================
echo.

cloudflared tunnel --url http://localhost:11434
pause
