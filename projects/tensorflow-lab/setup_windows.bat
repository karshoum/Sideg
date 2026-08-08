@echo off
REM ============================================================
REM  TensorFlow Lab - Automatic setup for Windows
REM  Run this file from the "Anaconda Prompt" window.
REM  (Arabic step-by-step guide: see README.md)
REM ============================================================
setlocal

set ENV_NAME=tf_env
set PY_VERSION=3.10

cd /d "%~dp0"

echo.
echo ============================================================
echo   TensorFlow Lab setup  ^|  environment: %ENV_NAME%
echo ============================================================
echo.

REM --- 1) Make sure conda is available -------------------------
where conda >nul 2>&1
if errorlevel 1 (
    echo [ERROR] "conda" was not found.
    echo         Install Anaconda first, then open "Anaconda Prompt"
    echo         from the Start menu and run this file again.
    echo.
    pause
    exit /b 1
)

REM --- 2) Create the environment if it does not exist ----------
call conda env list | findstr /R /C:"^%ENV_NAME% " >nul
if errorlevel 1 (
    echo [1/4] Creating environment %ENV_NAME% with Python %PY_VERSION% ...
    call conda create -n %ENV_NAME% python=%PY_VERSION% -y
    if errorlevel 1 goto :failed
) else (
    echo [1/4] Environment %ENV_NAME% already exists - skipping creation.
)

REM --- 3) Activate --------------------------------------------
echo [2/4] Activating %ENV_NAME% ...
call conda activate %ENV_NAME%
if errorlevel 1 goto :failed

REM --- 4) Install the libraries --------------------------------
echo [3/4] Installing TensorFlow and the data libraries ...
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
if errorlevel 1 goto :failed

REM --- 5) Register the Jupyter kernel --------------------------
echo [4/4] Registering the Jupyter kernel ...
python -m ipykernel install --user --name %ENV_NAME% --display-name "Python (TensorFlow)"
if errorlevel 1 goto :failed

echo.
echo ------------------------------------------------------------
echo  Verifying the installation ...
echo ------------------------------------------------------------
python verify_install.py
if errorlevel 1 goto :failed

echo.
echo ============================================================
echo   DONE. Next step: run  start_jupyter.bat
echo ============================================================
echo.
pause
exit /b 0

:failed
echo.
echo [ERROR] A step failed. Read the message above, fix it,
echo         then run this file again (it resumes safely).
echo.
pause
exit /b 1
