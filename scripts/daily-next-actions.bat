@echo off
setlocal
cd /c/Gitub-Projects/Taleem360-School-ERP

:: Ensure node is on PATH for this task
set PATH=C:\Program Files\nodejs;%PATH%

echo ===== Taleem360 Daily Next Actions =====

echo [1] npm run build
call npm run build
echo Build exit: %ERRORLEVEL%

echo [2] npm run lint
call npm run lint
echo Lint exit: %ERRORLEVEL%

echo [3] npm test --silent
call npm test --silent
echo Test exit: %ERRORLEVEL%

echo [4] Live endpoint checks
for %%G in (taleem360.online sitemap.xml ard.json ai-catalog.json) do (
  curl -s -o /dev/null -w "%%{http_code}%%" https://taleem360.online/%%G > code.tmp
  set /p CURLCODE=<code.tmp
  echo %%G: %CURLCODE%
)
del code.tmp

echo.
echo === Daily Next Actions complete. ===
