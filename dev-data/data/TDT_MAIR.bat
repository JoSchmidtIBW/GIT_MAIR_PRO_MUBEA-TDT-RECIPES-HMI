@ECHO OFF

REM Kommandozeilenfenster leeren
CLS

REM Die Windows-Codepage wird zu "1252" (westeuropäisch) geändert, dadurch kann unter anderem "ü" ausgegeben werden.
CHCP 1252

REM Fenster-Titel
TITLE TDT-MAIR-HMI


ECHO Start TDT-MAIR-HMI!


REM Color green
COLOR 0A




REM funktioniert mit wt
@echo off
start wt ^
    new-tab -p "Command Prompt" -d "C:\MAIR_PRO_Azure_DevOps_Mubea-TDT-Recipes-HMI\MAIR_Mubea_PRO-TDT-Recipes-HMI" cmd /k "npm run watch:js_dev"; ^
    timeout /t 20; ^
    new-tab -p "Command Prompt" -d "C:\MAIR_PRO_Azure_DevOps_Mubea-TDT-Recipes-HMI\MAIR_Mubea_PRO-TDT-Recipes-HMI" cmd /k "npm run dev"

REM funktioniert mit wt
REM @echo off
REM start wt ^
REM    new-tab -p "Windows PowerShell" -d "C:\MAIR_PRO_Azure_DevOps_Mubea-TDT-Recipes-HMI\MAIR_Mubea_PRO-TDT-Recipes-HMI" powershell -NoExit -Command "npm run watch:js_dev";^
REM    timeout /t 20; ^
REM    new-tab -p "Windows PowerShell" -d "C:\MAIR_PRO_Azure_DevOps_Mubea-TDT-Recipes-HMI\MAIR_Mubea_PRO-TDT-Recipes-HMI" powershell -NoExit -Command "npm run dev" ^

timeout /t 20


REM -----------------------------
REM Browser-Fenster 3: msedge http://127.0.0.1:8555/api/v1/overview
REM -----------------------------

start msedge http://127.0.0.1:8555/api/v1/overview