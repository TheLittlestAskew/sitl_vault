@echo off
rem Applies the reviewed spell-check, generates the note, propagates the vault, and pushes.
rem Launched by the "Approve & apply" toast button or the desktop shortcut.
title SITL - Approve session
cd /d "%~dp0"
echo Approving the pending SITL session (Phase B + Convo 2)...
echo.
"C:\Program Files\nodejs\node.exe" sitl_pipeline_watch.js --approve
echo.
if errorlevel 1 (
  echo FAILED — see _pipeline\watcher.log for details.
) else (
  echo Done. You can close this window.
)
pause
