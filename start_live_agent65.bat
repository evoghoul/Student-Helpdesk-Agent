@echo off
setlocal enabledelayedexpansion
title Agent 65 - Live Server & Public Tunnel Launcher
color 0A

echo =====================================================================
echo           AGENT 65: STUDENT HELPDESK - LIVE TUNNEL LAUNCHER
echo =====================================================================
echo.

:: 1. Verify Virtual Environment
if not exist "%~dp0BACKEND\.venv\Scripts\python.exe" (
    echo [!] Virtual environment not found at BACKEND\.venv
    echo [*] Please run: python -m venv BACKEND\.venv ^&^& BACKEND\.venv\Scripts\pip install -r BACKEND\requirements.txt
    pause
    exit /b 1
)

:: 2. Check Ollama Status
echo [*] Checking local Ollama AI daemon (agent65-8b:latest)...
powershell -Command "try { $r = Invoke-RestMethod -Uri 'http://localhost:11434/api/tags' -TimeoutSec 2; Write-Host '    [OK] Ollama is active with models: ' ($r.models.name -join ', ') -ForegroundColor Green } catch { Write-Host '    [!] Notice: Local Ollama daemon not detected. Starting Ollama or falling back to Groq/Gemini cloud cascade...' -ForegroundColor Yellow }"

:: 3. Launch FastAPI Backend in a separate window
echo.
echo [*] Starting FastAPI Backend on http://localhost:8000...
start "Agent 65 Backend (FastAPI)" cmd /k "cd /d "%~dp0BACKEND" && "%~dp0BACKEND\.venv\Scripts\python.exe" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

:: Wait 3 seconds for backend to initialize
timeout /t 3 /nobreak >nul

:: 4. Verify Backend Health
echo [*] Verifying backend health...
powershell -Command "try { $h = Invoke-RestMethod -Uri 'http://localhost:8000/health' -TimeoutSec 3; Write-Host '    [OK] Backend is healthy: ' $h.status -ForegroundColor Green } catch { Write-Host '    [!] Backend initializing...' -ForegroundColor Yellow }"

echo.
echo =====================================================================
echo                CHOOSE YOUR PUBLIC TUNNEL METHOD
echo =====================================================================
echo [1] Cloudflare Tunnel (Recommended: cloudflared - fast, stable HTTPS)
echo [2] LocalTunnel (Instant: requires zero installation via npx)
echo =====================================================================
set /p tunnel_choice="Enter your choice (1 or 2) [Default=1]: "

if "%tunnel_choice%"=="2" (
    goto run_localtunnel
)

:run_cloudflare
where cloudflared >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo [*] cloudflared is not yet installed in PATH.
    echo [*] Installing cloudflared via Windows Package Manager (winget)...
    winget install --id Cloudflare.cloudflared --accept-source-agreements --accept-package-agreements
    if !errorlevel! neq 0 (
        echo [!] Winget install failed or cancelled. Switching to LocalTunnel fallback...
        goto run_localtunnel
    )
)
echo.
echo [*] Launching Cloudflare Tunnel on http://localhost:8000...
echo [*] Look for the URL ending in .trycloudflare.com below:
echo =====================================================================
cloudflared tunnel --url http://localhost:8000
goto done

:run_localtunnel
echo.
echo [*] Launching LocalTunnel on port 8000...
echo [*] Copy the generated URL into your Vercel NEXT_PUBLIC_BACKEND_URL
echo =====================================================================
call npx localtunnel --port 8000

:done
pause
