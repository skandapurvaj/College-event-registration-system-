@echo off
REM Simple batch script to initialize MySQL database
setlocal enabledelayedexpansion

SET MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
SET DB_HOST=localhost
SET DB_USER=root
SET DB_NAME=college_event_registration

echo Creating database...
"!MYSQL_PATH!" -h !DB_HOST! -u !DB_USER! -e "DROP DATABASE IF EXISTS !DB_NAME!; CREATE DATABASE !DB_NAME!;"

if !errorlevel! neq 0 (
  echo Failed to create database. MySQL may require a password.
  echo Please update the batch file with your MySQL password.
  exit /b 1
)

echo Loading schema...
"!MYSQL_PATH!" -h !DB_HOST! -u !DB_USER! !DB_NAME! < sql\schema.sql

if !errorlevel! neq 0 (
  echo Failed to load schema.
  exit /b 1
)

echo Loading sample data...
"!MYSQL_PATH!" -h !DB_HOST! -u !DB_USER! !DB_NAME! < sql\sample_data.sql

if !errorlevel! neq 0 (
  echo Failed to load sample data.
  exit /b 1
)

echo.
echo Database initialization complete!
pause
