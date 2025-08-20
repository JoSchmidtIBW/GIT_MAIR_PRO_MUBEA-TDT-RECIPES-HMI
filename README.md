Damit nicht mehr angerufen wird, zum "neue Programm machet"...

# Mubea_PRO_MAIR-TDT-Recipes-HMI

## von Matthias Trudewind und John Schmidt

Azure DevOps- Repository zum Projekt "Mubea_PRO_MAIR-TDT-Recipes-HMI"

## Inhaltsverzeichnis

- [Einleitung](#einleitung)
- [Vorbereitung](#vorbereitung)
- [Installation](#installation)
- [Konfiguration](#konfiguration)
- [Benutzung](#benutzung)
- [Entwickler](#entwickler)
- [Lizenz](#lizenz)

## Einleitung

**Mubea_PRO_MAIR-TDT-Recipes-HMI**  
Mubea_PRO_MAIR-TDT-Recipes-HMI ist eine Web-Applikation, die auf einem node.js-Server mit dem Express-Framework basiert.  
Die Architektur folgt dem MVC (Model-View-Controller)-Muster und nutzt die Pug-Template-Engine sowie eine Datenbank namens MongoDB.
Darüber hinaus verwendet die Applikation Axios für die Kommunikation mit APIs und jQuery zur Vereinfachung der DOM-Manipulation und Event-Verarbeitung.

Die Webapplikation dient dazu, einen ersten bestehenden, Java-basierten Prototypen durch eine effizientere Prototypen- Lösung zu ersetzen. Mit ihr soll es möglich sein, neben dem Senden von Rezepten an eine SPS, auch über ein Login Rezepte zu erstellen und zu bearbeiten.

Die SPS- Schnittstelle ist OPC UA, und die SPS von Siemens

**Eigenschaften**

- Mehrsprachigkeit
  - Die Applikation ist auf Deutsch, Tschechisch und auf Englisch verfügbar
- Flexibilität bei Rezeptdaten:
  - Laden und Verarbeiten bestehender Rezepte,
    (Bei alten Rezepten ohne Geschwindigkeit dornVor und dornZurück, wird ein default-wert von 100% hinzugefügt)
  - Neu erstellte Rezepte können auch als .TXT- Dateien im ursprünglichen Format abgespeichert werden
    (mit Geschwindigkeit dornVor und dornZurück)
- Rezept- Erstellung
  - Rezepte können schneller und einfacher erstellt werden
  - Fehler bei der Rezept-Erstellung und Zeitverlust der Behebung werden minimiert.
- Nachverfolgung
  - Profisorisch implementierte Nachverfolgung für erste Einblicke
- Statistik
  - Profisorisch implementierte Statistik für erste Auswertungs- Einblicke
- Anwendungsfreundlichkeit und Anzeigen zusätzlicher Informationen
  - effizienteres Arbeiten und reduziert Rückfragen

**Architektur**

- Die Anwendung ist aktuell nur client- seitig geschützt und nicht server- seitig abgesichert. Jedoch könnte sie für eine richtige API ausgebaut werden.
- API-First
  - Ermöglicht Flexibilität und den Austausch des Fontends.
- Service-orientierte Architektur (SOA)
  - Um Modularität und Wiederverwendbarkeit zu gewährleisten.
- REST-API
  - Dient zur Kommunikation zwischen Systemen über HTTP.

Hinweis: Die Orchestrierung erfolgt im Backend: Beim gleichzeitigen Schreiben in die SPS werden ein Log-Datenbankeintrag erstellt und die Statistik-Datenbank aktualisiert.

&nbsp;

## Vorbereitung

### Voraussetzungen

Bevor Sie dieses Projekt verwenden können, stellen Sie sicher, dass die folgenden Voraussetzungen erfüllt sind, bevor Sie mit dem Projekt fortfahren:

- Betriebssystem: Windows 11 (oder eine kompatible Version)
- Webbrowser: Unterstützt werden die neuesten Versionen von Google Chrome und Microsoft Edge.
- Node.js: Stellen Sie sicher, dass Sie Node.js in Version 10.0.0 oder höher installiert haben. Sie können Node.js von der offiziellen Website herunterladen und installieren: https://nodejs.org/en/.
- NPM: NPM (Node Package Manager) wird zusammen mit Node.js installiert und sollte automatisch verfügbar sein. Sie können überprüfen, ob NPM installiert ist, indem Sie den Befehl npm --version in Ihrer Befehlszeile ausführen. https://www.npmjs.com/
- MongoDB: Installieren Sie MongoDB in Version 10.10.2. Sie können MongoDB von der offiziellen Website herunterladen und entsprechend den Anweisungen installieren: https://www.mongodb.com/.

## Installation

Um das Projekt einzurichten, gehen Sie folgendermaßen vor:

1. Navigieren Sie zum Hauptverzeichnis des Projekts.
2. Öffnen Sie die Befehlszeile (Command Prompt) oder das Terminal.
3. Installieren Sie alle erforderlichen Abhängigkeiten mit folgendem Befehl:

```bash
npm install
```

(oder: npm install --legacy-peer-deps)

## Konfiguration(und Mitentwicklung)

Um die Konfiguration vorzunehmen, befolgen Sie bitte die folgenden Schritte:

1. Navigieren Sie zum Hauptverzeichnis des Projekts.
2. Erstellen Sie eine Datei mit dem Namen 'config.env' im Hauptverzeichnis.
3. Fügen Sie die folgenden Zeilen in die config.env-Datei ein:

---

```bash
#Development Environment Configuration
NODE_ENV=Development

#Port Configuration
DEV_PORT=8555
PROD_PORT=8557

#DB Configuration
#const DB = 'mongodb://127.0.0.1:27017/TDT_MubeaDB';
DB_CONNECTOR=mongodb
DB_HOST=127.0.0.1
DB_PORT=27017
DB_NAME=Mubea_PRO_MAIR_TDT

#JWT Configuration
JWT_SECRET=my-ultra-secure-and-ultra-long-secret32reMoNthianOmENAnIsiaLEGUIRPREnCT32
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
#ablaufdatum 90d 10h, 5m , 3s   , 5milisecond oder 5000 for 5s          30000
#JWT_EXPIRES_IN=90d
#JWT_COOKIE_EXPIRES_IN=90

#CRYPTOJS Configuration
CRYPTOJS_SECRET_KEY=mySecretKey1

#PLC / SPS Configuration
PLC_IP=192.168.112.10 # ipSPSZumAnPingen = '192.168.112.10';
PLC_LOCAL_AMS_NET_ID=192.168.112.1.1 # localAmsNetId: '192.168.112.1.1', // Lokale AMS-Net-ID // ist ev TwinCat von meinem PC
PLC_TARGET_AMS_NET_ID=5.70.225.241.1.1 # targetAmsNetId: '5.70.225.241.1.1', // AMS-Net-ID der Beckhoff-SPS
PLC_TARGET_ADS_PORT=851 # Ziel-ADS-Port, Standard-ADS-Port wie 851, 852, 801
PLC_ROUTER_TCP_PORT=48898 # Offener TCP-Port auf der SPS

#PLC / Globale_Variablen
PLC_GVL_VCSVNAME=GVL.vCsvName #gvl_vCsvName 'GVL.vCsvName'
PLC_GVL_NAME=GVL #gvl_Name 'GVL'

#--------------------------------------------
#OPC-UA_PLC
#const endpointUrl = 'opc.tcp://127.0.0.1:4334/UA/MyServer'; // Dein OPC UA Server
#const nodeIdToMonitor = 'ns=1;s=MyStringVariable'; // Die zu überwachende Variable
PLC_OPCUA_DEVICE=myDevice #brauche ich im moment noch nicht 05.06.2025
#PLC_OPCUA_ENDPOINTURL=opc.tcp://127.0.0.1:4334/UA/MyServer
PLC_OPCUA_ENDPOINTURL=opc.tcp://192.168.0.112:4840#/UA/MyServer
PLC_OPCUA_STRUCTNAME=Baustein_1#Baustein_1_DB_1#Baustein_1#Baustein_1_DB_1#TDT_ExchangeArea #myDevice stimmt nicht... #brauche ich im moment noch nicht 05.06.2025
PLC_OPCUA_NODEIDTOMONITOR=ns=1;s=MyStringVariable
#PLC_OPCUA_VARIABLE=MyStringVariable
#  const nodeId = `ns=4;s=${DEVICE}.${STRUCT}.${VARIABLE}`;
#  ns=4;s=myDevice.TDT_ExchangeArea.MyStringVariable
#PLC_OPCUA_NODEID_RECIPE_NAME=ns=1;s=RECIPE_NAME funktioniert
#PLC_OPCUA_NODEID_RECIPE_NAME=ns=3;s=Baustein_1_DB_1.RECIPE_NAME
#PLC_OPCUA_NODEID_RECIPE_NAME=ns=3;s="Baustein_1"."RECIPE_NAME"
#PLC_OPCUA_NODEID_RECIPE_NAME=ns=3;s=Baustein_1.RECIPE_NAME
PLC_OPCUA_NODEID_RECIPE_NAME=ns=3;s=RECIPE_NAME
#PLC_OPCUA_NODEID_STEP_POSITIONS=ns=1;s=STEP_POSITIONS funktioniert
#PLC_OPCUA_NODEID_STEP_POSITIONS=ns=3;s=Baustein_1.STEP_POSITIONS
PLC_OPCUA_NODEID_STEP_POSITIONS=ns=3;s=STEP_POSITIONS
#PLC_OPCUA_NODEID_STEP_POSITIONS_NODE_POS=ns=1;s=STEP_POSITIONS.Pos funktioniert
#PLC_OPCUA_NODEID_STEP_POSITIONS_NODE_POS=ns=3;s=STEP_POSITIONS.Pos
#PLC_OPCUA_NODEID_STEP_POSITIONS_NODE_POS=ns=3;s=Baustein_1.STEP_POSITIONS.Pos
PLC_OPCUA_NODEID_STEP_POSITIONS_NODE_POS=ns=3;s=STEP_POSITIONS.Pos
PLC_OPCUA_STEP_POSITIONS_ARRAY_SIZE=200#1
PLC_OPCUA_STEP_POSITIONS_ARRAY_START_VALUE=1#0#1
PLC_OPCUA_ACCELERATION_VALUE=9000#9.5# 9mm2 --> 0-9000
PLC_OPCUA_WITHSIMATIC=1#1 for PLC-Siemens-Simatic is activ


PLC_OPCUA_NODEID__STRUCKTNAME=ns=3;s="Baustein_1_DB_1"
PLC_OPCUA_NODEID__RECIPE_NAME="RECIPE_NAME"#`ns=3;s="Baustein_1_DB_1"."RECIPE_NAME"`
PLC_OPCUA_NODEID__STEP_POSITIONS="STEP_POSITIONS"
PLC_OPCUA_NODEID__STPO_POS="Pos"
PLC_OPCUA_NODEID__STPO_POS_POS=POS
PLC_OPCUA_NODEID__STPO_POS_SPEED=Speed
PLC_OPCUA_NODEID__STPO_POS_ACCELERATION=Acceleration
PLC_OPCUA_NODEID__STPO_POS_STROKE=Stroke
#`ns=3;s="Baustein_1_DB_1"."RECIPE_NAME"`,
# const prefix = `ns=3;s="Baustein_1_DB_1"."STEP_POSITIONS"."Pos"[${i}]`;

#        readValueOnly(clientSession.sessionOPCUA, `${prefix}.POS`),
#        readValueOnly(clientSession.sessionOPCUA, `${prefix}.Speed`),
#        readValueOnly(clientSession.sessionOPCUA, `${prefix}.Acceleration`),
#        readValueOnly(clientSession.sessionOPCUA, `${prefix}.Stroke`),




#`ns=3;s=V_"Baustein_1"."STEP_POSITIONS".Pos[${i}]`


#NodeId="ns=3;i=3063" BrowseName="3:SimaticOperatingState" SPS Run Stop...
#NodeId="ns=3;i=1002" BrowseName="3:SimaticDeviceType
# NodeId="ns=3;s=PLC PLC with OPC UA...
#NodeId="ns=3;s=PLC" BrowseName="3:PLC_1" PLC instance which supports you with OPC UA functionality
#--------------------------------------------

#PLC ASMAG Beckhoff / SPS Configuration
#PLC_IP=192.168.111.10#192.168.112.10 # ipSPSZumAnPingen = '192.168.112.10';
#PLC_LOCAL_AMS_NET_ID=10.28.8.118.1.1#192.168.112.1.1 # localAmsNetId: '192.168.112.1.1', // Lokale AMS-Net-ID // ist ev TwinCat von meinem PC
#PLC_TARGET_AMS_NET_ID=5.25.221.30.1.1 # targetAmsNetId: '5.70.225.241.1.1', // AMS-Net-ID der Beckhoff-SPS
#PLC_TARGET_ADS_PORT=801#802#801 # Ziel-ADS-Port, Standard-ADS-Port wie 851, 852, 801
#PLC_ROUTER_TCP_PORT=48898 # Offener TCP-Port auf der SPS
#PLC_GLOBALE_VARIABLEN_GVL=""#Globale_Variablen #GVL
#PLC_GVL_VCSVNAME=vCsvName

# ASMAG - Paths for file storage (.TXT-recipes and .CSV- PLC-Positions/adjustment)
#FILE_STORAGE_PATH=C:\\Users\\Arb-US_WS\\Desktop
#FOLDER_STORAGE_RECIPES_CSV=\\myRecipesAndCSVFromAPP

# Paths for file storage (.TXT-recipes and .CSV- PLC-Positions/adjustment)
FILE_STORAGE_PATH=C:\\Users\\Schmidtjo\\Work Folders\\Desktop
FOLDER_STORAGE_RECIPES_CSV=\\Mubea_PRO_MAIR_myRecipesAndCSVFromAPP

```

---

Speichern Sie die 'config.env-Datei', nachdem Sie die Konfigurationseinstellungen vorgenommen haben.
--> Bei Mitentwicklung muss erst allgemein informiert werden, wie auch eine .gitignore erstellt werden usw.

## Benutzung (lokal)

Für die Verwendung der Web-Anwendung müssen sowohl der Bundler als auch der Server ausgeführt werden. Stellen Sie sicher, dass beide Komponenten ordnungsgemäß laufen.

Wenn Sie Tests durchführen möchten, muss der Server ebenfalls gestartet sein, da die Tests auf den laufenden Server zugreifen müssen.

### Bundler im Entwicklungs- Modus starten

Mit folgendem Befehl wird der Bundler gestartet:

```bash
npm run watch:js_dev
```

### Server im Entwicklungsmodus starten

Mit folgendem Befehl wird der Server im Entwicklungs- Modus gestartet:

```bash
npm run dev
```

---

### Gestarteter Prozess beenden

Mit folgendem Befehl kann ein gestarteter Prozess beendet werden:

```bash
crtl+c
```

### Debugger starten

Mit folgendem Befehl wird der Debugger gestartet:

```bash
npm run debug
```

---

### Unit- Test's starten (hat es keine 😝 )

Mit folgendem Befehl werden die Unit- Tests gestartet:

```bash
npm run test
```

### End-toEnd- Test's starten (hat es keine ( ¬‿¬) )

Mit folgendem Befehl werden die End-to-End- Tests gestartet:

```bash
npm run test_selenium
```

---

### Datenbank erzeugen:

Mit folgendem Befehl wird die Datenbank erzeugt:

```bash
node .\dev-data\data\import-dev-data.mjs --import
```

### Datenbank löschen:

Mit folgendem Befehl wird die Datenbank gelöscht:

```bash
node .\dev-data\data\import-dev-data.mjs --delete
```

---

## Produktions-Modus 🫣⛔

### Bundler im Produktions- Modus starten (Provisorisch, ⛔🚧🫤 noch nicht getestet!)

Mit folgendem Befehl wird der Bundler gestartet:

```bash
npm run build:js_prod
```

### Server im Produktions- Modus starten (Provisorisch, ⛔🚧🫤 noch nicht getestet!)

Mit folgendem Befehl wird der Server im Produktions- Modus gestartet:

```bash
npm run start:prod
```

---

### Login als Admin

Um sich als Admin anzumelden, verwenden Sie bitte die folgenden Anmeldeinformationen:

- employeenumber:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**70220**
- password:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**test1234**

Geben Sie diese Informationen im Browser ein, um sich als Admin anzumelden.

---

## Entwickler

Matthias Trudewind, John Schmidt, 2024

## Lizenz

&copy; von Mubea AG. Alle Rechte vorbehalten.
