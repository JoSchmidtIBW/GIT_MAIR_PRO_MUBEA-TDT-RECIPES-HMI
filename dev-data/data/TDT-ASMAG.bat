REM --- Kommandozeilenfenster leeren
CLS

REM --- Die Windows-Codepage wird zu "1252" (westeuropäisch) geändert, dadurch kann unter anderem "ü" ausgegeben werden.
CHCP 1252

REM --- Der Titel des Fensters
TITLE TDT-ASMAG-HMI

REM --- Farbtabelle im Konsolen-Fenster
COLOR /b

REM --- Grüne Konsolen-Schriftfarbe
COLOR 0A


REM ---------------------------------------
REM CMD-Fenster 1: MongoDB starten
REM ---------------------------------------

REM start "" cmd /k "cd /d C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath C:\DBNEU

REM gpt...    start "" cmd /k "\"C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe\" --dbpath C:\DBNEU"
start "" cmd /k "C:\Users\Arb-US_WS\Desktop\DBNEU.bat"

REM ---------------TimeOut-----------------
timeout /t 5


REM ---------------------------------------
REM CMD-Fenster 2: Parcel-Bundler starten
REM ---------------------------------------
start "" cmd /k "mode con: cols=120 lines=30 && title Parcel-Bundler && cd /d C:\GIT_Azure_DevOps_Mubea-TDT-Recipes-HMI\Mubea-TDT-Recipes-HMI && npm run watch:js_dev"


REM ---------------TimeOut-----------------
timeout /t 15


REM ---------------------------------------
REM CMD-Fenster 3: Express-Server starten
REM ---------------------------------------
start "" cmd /k "title Express-Server && cd /d C:\GIT_Azure_DevOps_Mubea-TDT-Recipes-HMI\Mubea-TDT-Recipes-HMI && set NODE_TLS_REJECT_UNAUTHORIZED=0 && npm run dev"


REM ---------------TimeOut-----------------
timeout /t 15


REM ---------------------------------------
REM Browser-Fenster: Edge starten
REM ---------------------------------------
start msedge http://127.0.0.1:6555/api/v1/overview


EXIT