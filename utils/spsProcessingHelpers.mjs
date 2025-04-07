export function zuordnenDornPositionen(
  eckenArray,
  wanddickenArray,
  dornPositionen,
) {
  console.log('Starte Zuordnung der Dornpositionen');
  let resultArray = [];

  console.log('zuordnenDornPositionen: eckenArray:', eckenArray);
  console.log('zuordnenDornPositionen: wanddickenArray:', wanddickenArray);
  console.log('zuordnenDornPositionen: dornPositionen:', dornPositionen);

  // 1. Mapping-Objekt erstellen: Jede Wanddicke bekommt eine Dornposition
  let wanddickeZuDornPosMap = {}; // Dies ist das Mapping-Objekt
  for (let i = 0; i < wanddickenArray.length; i++) {
    let wanddicke = wanddickenArray[i]; // aktuelle Wanddicke
    let dornPosition = dornPositionen[i]; // dazugehörige Dornposition
    wanddickeZuDornPosMap[wanddicke] = dornPosition; // Wanddicke -> Dornposition
  }
  console.log(
    'Zuordnung von Wanddicke zu Dornposition:',
    wanddickeZuDornPosMap,
  );

  // 2. Ergebnis-Array erstellen: Hinzufügen von Dornpositionen zu jedem Eckpunkt
  for (let ecke of eckenArray) {
    let aktuelleWanddicke = ecke.z; // Die Wanddicke der aktuellen Ecke
    let dornPosZuWanddicke = wanddickeZuDornPosMap[aktuelleWanddicke]; // Passende Dornposition
    console.log('dornPosZuWanddicke', dornPosZuWanddicke);

    // Neue Ecke mit zusätzlicher Dornposition erstellen
    resultArray.push({
      x: ecke.x,
      z: ecke.z,
      dVerst: dornPosZuWanddicke, // Die Dornposition, die zur Wanddicke passt
    });
  }

  return resultArray;
}

export function checkWallThicknessArray(wanddickenArray) {
  console.log('bin checkWallThicknessArray');

  for (let i = 1; i < wanddickenArray.length; i++) {
    if (wanddickenArray[i] >= wanddickenArray[i - 1]) {
      console.log('Fehler: Die Wanddicken müssen aufsteigend sein!');
      return false;
    }
  }
  console.log('Wanddicken- Namen im Array korrekt: ', wanddickenArray);
  return true;
}

export function checkWallTicknesInCornerArrayWithoutBetweenCorner(
  eckenArrOhneZE,
) {
  console.log('bin checkWallTicknesInCornerArrayWithoutBetweenCorner');

  for (let i = 1; i < eckenArrOhneZE.length; i++) {
    if (eckenArrOhneZE[i].x <= eckenArrOhneZE[i - 1].x) {
      console.log(
        'Fehler: Die Positionen im eckenArray müssen aufsteigend sein!',
      );
      return false;
    }
  }
  console.log('Positionen im eckenArray im Array korrekt: ', eckenArrOhneZE);
  return true;
}

export function checkDornPositions(dornStufenPositionenArr) {
  console.log('bin checkDornPositions');
  if (dornStufenPositionenArr[0] !== 0) {
    console.log('Fehler: Das Array muss mit 0 beginnen.');
    return false;
  }

  for (let i = 1; i < dornStufenPositionenArr.length; i++) {
    if (dornStufenPositionenArr[i] <= dornStufenPositionenArr[i - 1]) {
      console.log('Fehler: Die Positionen müssen aufsteigend sein!');
      return false;
    }
  }

  console.log('Dornpositionen korrekt: ', dornStufenPositionenArr);
  return true;
}

//TODO: UNIT-Test :)
export function newDateTimeNow() {
  const date = new Date();

  // Datum erstellen
  let day = date.getDate(); // Gibt den Tag (1-31) zurück
  let month = date.getMonth() + 1; // Gibt den Monat (0-11) zurück, daher +1 für richtige Zahl
  let year = date.getFullYear(); // Gibt das volle Jahr (z.B. 2024) zurück

  // Wenn der Tag oder Monat nur eine Ziffer hat, fügen wir eine "0" davor ein
  if (day < 10) {
    day = '0' + day;
  }
  if (month < 10) {
    month = '0' + month;
  }

  // So sieht unser Datum aus: "TT.MM.JJJJ"
  const newDatum = day + '.' + month + '.' + year;

  // Uhrzeit erstellen
  let hours = date.getHours(); // Gibt die Stunden zurück (0-23)
  let minutes = date.getMinutes(); // Gibt die Minuten zurück (0-59)

  // Auch hier: Falls Stunden oder Minuten nur eine Ziffer haben, fügen wir eine "0" davor ein
  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  // So sieht unsere Uhrzeit aus: "HH.MM"
  const newUhrzeit = hours + '.' + minutes;

  //   console.log('Datum:', newDatum);
  //   console.log('Uhrzeit:', newUhrzeit);
  let newDateTime = newDatum + ':' + newUhrzeit;
  return newDateTime;
}
