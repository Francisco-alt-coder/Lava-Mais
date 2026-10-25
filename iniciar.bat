@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"
title Lava Mais - Demonstracao

where node >nul 2>&1
if errorlevel 1 (
  echo [ERRO] Node.js nao encontrado. Instale Node.js 20 ou superior.
  echo Consulte README.md.
  pause
  exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
  echo [ERRO] npm nao encontrado. Verifique a instalacao do Node.js.
  pause
  exit /b 1
)

if not exist node_modules (
  echo [1/3] Instalando dependencias. Na primeira vez, e necessario ter internet.
  call npm ci --no-audit --no-fund
  if errorlevel 1 (
    echo [ERRO] Nao foi possivel instalar as dependencias.
    echo Verifique sua internet e execute novamente este arquivo.
    pause
    exit /b 1
  )
)

if not exist .env (
  copy .env.example .env >nul
)

echo [2/3] Preparando a demonstracao...
echo [3/3] Iniciando o Lava Mais.
echo.
echo Se o navegador nao abrir, digite: http://localhost:3000
echo Mantenha esta janela aberta durante a apresentacao.
echo Para parar, pressione Ctrl+C nesta janela.
echo.
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 3; Start-Process 'http://localhost:3000'"
call npm start

echo.
echo O servidor foi encerrado. Se apareceu um erro, consulte README.md.
pause
endlocal
