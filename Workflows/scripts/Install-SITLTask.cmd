@echo off
rem ───────────────────────────────────────────────────────────────
rem  One-time installer: registers the "SITL Pipeline Watcher" logon task,
rem  mirroring WTFF/Ashfall. Starts the hidden watcher at every logon.
rem  Self-elevates via UAC (task creation needs admin). Just double-click it.
rem ───────────────────────────────────────────────────────────────
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
  echo Done. "SITL Pipeline Watcher" is registered and will start hidden at next logon.
  echo To start it now without logging out, double-click start-watcher-hidden.vbs.
) else (
  echo Registration FAILED ^(exit %errorlevel%^). See the message above.
)
echo.
pause
