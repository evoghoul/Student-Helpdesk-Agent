@echo off
title Agent 65 - Laptop Hybrid Ollama Tunnel (Permanent Domain)
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
echo [2/2] Checking Permanent Tunnel (ngrok)...
if exist "%~dp0ngrok.exe" (
    echo   [OK] Found ngrok.exe with permanent domain configured!
    goto run_ngrok
)

where ngrok >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    goto run_ngrok
)

echo   [!] ngrok was not found. Falling back to Cloudflare Tunnel...
goto run_cloudflare

:run_ngrok
echo.
echo ========================================================
echo   PERMANENT STATIC DOMAIN (NEVER CHANGES):
echo   https://resonate-trimester-glade.ngrok-free.dev
echo.
echo   Render LOCAL_MODEL_URL:
echo   https://resonate-trimester-glade.ngrok-free.dev
echo ========================================================
echo.
echo Press Ctrl+C anytime to stop.
echo ========================================================
echo.

"%~dp0ngrok.exe" http 11434 --url=resonate-trimester-glade.ngrok-free.dev
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [!] ngrok exited with code %ERRORLEVEL%. Switching to Cloudflare fallback...
    goto run_cloudflare
)
pause
exit /b 0

:run_cloudflare
echo.
echo ========================================================
echo   STARTING CLOUDFLARE QUICK TUNNEL (FALLBACK)
echo ========================================================
if exist "%~dp0cloudflared.exe" (
    "%~dp0cloudflared.exe" tunnel --url http://localhost:11434
) else (
    cloudflared tunnel --url http://localhost:11434
)
pause
