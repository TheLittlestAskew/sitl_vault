@echo off
rem One-time installer: registers the "SITL Pipeline Watcher" logon task.
net session >nul 2>&1
if %errorlevel% neq 0 (
  echo Requesting administrator rights...
  powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)
set "VBS=%~dp0start-watcher-hidden.vbs"
schtasks /Create /TN "SITL Pipeline Watcher" /TR "wscript.exe \"%VBS%\"" /SC ONLOGON /RL LIMITED /F
echo.
if %errorlevel%==0 (
  echo Done. "SITL Pipeline Watcher" registered; starts hidden at next logon.
  echo To start now without logging out, double-click start-watcher-hidden.vbs.
) else (
  echo Registration FAILED ^(exit %errorlevel%^).
)
echo.
pause