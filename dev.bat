@echo off
set PATH=%ProgramFiles%\nodejs;%PATH%
cd /d "%~dp0"
call node_modules\.bin\next.cmd dev
