@echo off
setlocal

title NEXORA ACCESS - Development Server

echo.
echo ==========================================
echo        NEXORA ACCESS
echo        Development Launcher
echo ==========================================
echo.

REM ==========================================
REM PROJECT PATHS
REM ==========================================

set "PROJECT_DIR=E:\NEXORA_ACCESS"
set "BACKEND_DIR=%PROJECT_DIR%\backend"
set "FRONTEND_DIR=%PROJECT_DIR%"
set "VENV_DIR=%BACKEND_DIR%\venv"
set "PYTHON_EXE=%VENV_DIR%\Scripts\python.exe"

REM ==========================================
REM CHECK PROJECT
REM ==========================================

if not exist "%PROJECT_DIR%" (
    echo ERROR: Project directory not found:
    echo %PROJECT_DIR%
    pause
    exit /b 1
)

if not exist "%BACKEND_DIR%\main.py" (
    echo ERROR: Backend main.py not found:
    echo %BACKEND_DIR%\main.py
    pause
    exit /b 1
)

if not exist "%FRONTEND_DIR%\package.json" (
    echo ERROR: Frontend package.json not found:
    echo %FRONTEND_DIR%\package.json
    pause
    exit /b 1
)

REM ==========================================
REM CREATE PYTHON 3.12 VENV ONLY IF MISSING
REM ==========================================

echo [1/5] Checking backend environment...
echo.

if not exist "%PYTHON_EXE%" (

    echo Backend virtual environment not found.
    echo Creating Python 3.12 virtual environment...
    echo.

    py -3.12 -m venv "%VENV_DIR%"

    if errorlevel 1 (
        echo.
        echo ERROR: Could not create Python 3.12 virtual environment.
        echo Make sure Python 3.12 is installed.
        pause
        exit /b 1
    )

    echo.
    echo Virtual environment created successfully.
)

REM ==========================================
REM VERIFY PYTHON
REM ==========================================

echo.
echo [2/5] Checking Python version...
echo.

"%PYTHON_EXE%" --version

if errorlevel 1 (
    echo.
    echo ERROR: Backend Python executable could not be started.
    pause
    exit /b 1
)

REM ==========================================
REM INSTALL BACKEND DEPENDENCIES IF NEEDED
REM ==========================================

echo.
echo [3/5] Checking backend dependencies...
echo.

"%PYTHON_EXE%" -c "import fastapi, uvicorn, cv2, mediapipe, matplotlib, PIL" >nul 2>&1

if errorlevel 1 (

    echo Required backend packages are missing.
    echo Installing NEXORA backend dependencies...
    echo.

    "%PYTHON_EXE%" -m pip install --upgrade pip

    "%PYTHON_EXE%" -m pip install ^
        fastapi ^
        "uvicorn[standard]" ^
        pydantic==2.10.6 ^
        opencv-python ^
        mediapipe==0.10.21 ^
        matplotlib==3.10.8 ^
        Pillow==11.3.0 ^
        kiwisolver

    if errorlevel 1 (
        echo.
        echo ERROR: Backend dependency installation failed.
        pause
        exit /b 1
    )

) else (

    echo Backend dependencies are already installed.
)

REM ==========================================
REM CHECK FRONTEND NODE MODULES
REM ==========================================

echo.
echo [4/5] Checking frontend dependencies...
echo.

if not exist "%FRONTEND_DIR%\node_modules" (

    echo Frontend node_modules not found.
    echo Installing frontend dependencies...
    echo.

    cd /d "%FRONTEND_DIR%"

    call npm install

    if errorlevel 1 (
        echo.
        echo ERROR: Frontend npm install failed.
        pause
        exit /b 1
    )

)

REM ==========================================
REM START BACKEND
REM ==========================================

echo.
echo [5/5] Starting NEXORA...
echo.

start "NEXORA BACKEND" cmd /k "cd /d "%BACKEND_DIR%" && "%PYTHON_EXE%" -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"

REM ==========================================
REM WAIT FOR BACKEND WINDOW
REM ==========================================

timeout /t 3 /nobreak >nul

REM ==========================================
REM START FRONTEND
REM ==========================================

start "NEXORA FRONTEND" cmd /k "npm run dev"

REM ==========================================
REM DISPLAY INFORMATION
REM ==========================================

echo.
echo ==========================================
echo       NEXORA ACCESS IS STARTING
echo ==========================================
echo.
echo Backend:
echo http://127.0.0.1:8000
echo.
echo API Documentation:
echo http://127.0.0.1:8000/docs
echo.
echo Frontend:
echo http://localhost:5173
echo.
echo ==========================================
echo.
echo Backend and frontend have been opened
echo in separate command windows.
echo.
pause

endlocal