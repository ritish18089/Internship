@echo off
set "JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.11.9-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Starting Carlofy Backend...
start "Backend" cmd /c "cd backend && mvn spring-boot:run"

echo Starting Carlofy Frontend...
npm run dev
