@echo off
REM ============================================================
REM  Activates tf_env and opens Jupyter Lab in this folder.
REM  Inside Jupyter choose the kernel:  Python (TensorFlow)
REM ============================================================
setlocal

set ENV_NAME=tf_env
cd /d "%~dp0"

where conda >nul 2>&1
if errorlevel 1 (
    echo [ERROR] "conda" was not found. Open "Anaconda Prompt" and run this file from there.
    pause
    exit /b 1
)

call conda activate %ENV_NAME%
if errorlevel 1 (
    echo [ERROR] Could not activate %ENV_NAME%. Run setup_windows.bat first.
    pause
    exit /b 1
)

echo Starting Jupyter Lab ... (close this window to stop the server)
jupyter lab
