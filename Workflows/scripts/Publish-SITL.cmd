@echo off
setlocal
REM Publish-SITL.cmd - regenerate the public session index, then commit and push.
REM The website reads session notes AND Public Session Index.json directly from
REM this repo's main branch, so a successful push IS the publish.
REM Allow ~5 minutes for CDN cache.
cd /d "%~dp0..\.."

REM --- Step 1: regenerate the public session index -------------------------
REM Added 2026-08-31. Without this the site silently shows stale data: S23's
REM note existed and was pushed, but the index still said S22, so the session
REM never appeared. The index is the ONLY thing the site reads for the session
REM list - the notes alone are not enough.
echo Regenerating Public Session Index.json ...
node "Workflows\scripts\generate_public_session_index.mjs"
if errorlevel 1 (
  echo.
  echo INDEX GENERATION FAILED - nothing has been committed or pushed.
  echo The generator refuses to publish a session whose note or required
  echo frontmatter is missing. Fix what it reported above, then rerun this file.
  pause
  exit /b 1
)
echo.

REM --- Step 2: commit and push --------------------------------------------
git add -A
git diff --cached --quiet
if %errorlevel%==0 (
  echo Nothing to publish - no changes since last push.
  pause
  exit /b 0
)
git commit -m "notes: publish %DATE% %TIME%"
git pull --rebase origin main
if errorlevel 1 (
  echo PULL FAILED - resolve conflicts in Obsidian Git, then rerun this file.
  pause
  exit /b 1
)
git push origin main
if errorlevel 1 (
  echo PUSH FAILED - check network/credentials and rerun.
  pause
  exit /b 1
)
echo Published. Site reflects changes within ~5 minutes.
pause
