@echo off
rem Launches the SITL pipeline watcher and tees all output to watcher.log.
rem Started hidden by start-watcher-hidden.vbs (which is started by Task Scheduler at logon).
rem %~dp0 = this script's folder (<vault>\Workflows\scripts\); ..\..\ = vault root.
cd /d "%~dp0"
:loop
"C:\Program Files\nodejs\node.exe" sitl_pipeline_watch.js >> "%~dp0..\..\_pipeline\watcher.log" 2>&1
echo [%date% %time%] watcher exited, restarting in 30s... >> "%~dp0..\..\_pipeline\watcher.log"
timeout /t 30 /nobreak >nul
goto loop
