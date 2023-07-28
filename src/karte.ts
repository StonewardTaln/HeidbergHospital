/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { Popup } from "@workadventure/iframe-api-typings";

console.log('Script started successfully');

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    
    //code here
    showScore();
    clock();

    
    ncp1();
    npc2();

    //variables
    setVariables();


    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

function clock() {
  //gets and show the time at the reception
  WA.room.area.onEnter('zoneClock').subscribe(() => {
    const today = new Date();
    const time = today.getHours() + ":" + today.getMinutes();
    currentPopup = WA.ui.openPopup("popupClock", "Es ist " + time, []);
  })

  WA.room.area.onLeave('zoneClock').subscribe(closePopup);
}

function showScore() {
  //displays current Score as a popup
  WA.room.area.onEnter('zoneScore').subscribe(() => {
    //console.log(WA.player.name, ' entered score zone');
    currentPopup = WA.ui.openPopup("popupScore", "Score: " + WA.player.state.score, []);
  })

  //closes popup when leaving zone
  WA.room.area.onLeave('zoneScore').subscribe(closePopup);
}

function npc2() {
  let popClosedHand = false;

  WA.room.area.onEnter('npc2').subscribe(() => {
    console.log("enter Zone NPC2");

    currentPopup = WA.ui.openPopup("popup2NPC", 'Wollen Sie den Punktestand zurücksetzen?', [{
      label: "Nein",
      className: "primary",
      callback: (currentPopup) => {
        // Close the popup when the "Close" button is pressed.
        currentPopup.close();
        popClosedHand = true;
      }
    },
    {
      label: "Ja",
      className: "error",
      callback: (currentPopup) => {
        setVariables();
        //toDo hasBeenSpokenTo = false;
        //toDo popClosedHand = false;

        // Close the popup when the "Close" button is pressed.
        currentPopup.close();
        popClosedHand = true;
      }
    }]);

    WA.room.area.onLeave('npc2').subscribe(() => {
      if (!popClosedHand) {
        currentPopup.close();
      }
    })
  })
}

function ncp1() {
  let hasBeenSpokenTo = false;
  let popClosedHand = false;

  WA.room.area.onEnter('npc1').subscribe(() => {
    console.log("entered npc1 zone");

    if (!hasBeenSpokenTo) {
      //start dialoging
      currentPopup = WA.ui.openPopup("popup1", 'Willkommen im Hospital, wie kann ich Ihnen weiterhelfen?', [{
        label: "Hallo, mein Name ist " + WA.player.name + ". Ich bin für die Prozessanalyse hier.",
        className: "primary",
        callback: (currentPopup) => {
          // Close the popup when the "Close" button is pressed.
          currentPopup.close();

          dialogChooseRole();
          hasBeenSpokenTo = true;
          }
      }]);
    } else {
      currentPopup = WA.ui.openPopup("popup1", 'Nutzen Sie die Meetingräume, um sich mit anderen auszutauschen!', [{
        label: "Okay",
        className: "primary",
        callback: (currentPopup) => {
          // Close the popup when the "Close" button is pressed.
          popClosedHand = true;
          currentPopup.close();
          }
      }]);

      WA.room.area.onLeave('npc1').subscribe(() => {
        if (hasBeenSpokenTo && !popClosedHand) {
          currentPopup.close();
        }
      })
    }
  })

  
  
}

function dialogLeftWay() {
  let directions = "";

  if (WA.player.state.role == "med") {
    directions = "Den Hauptgang entlang, dann zweimal links. Wahrscheinlich finden Sie jemanden im Pausenraum.";
    
  } else if (WA.player.state.role == "inf") {
    directions="Den Hauptgang entlang, dann links. Als nächstes rechts und Sie sind bei den Büros.";
  } else {
    console.log("Error: no role choosen");
  }

  currentPopup = WA.ui.openPopup("popup1", directions, [{
    label: "Danke",
    className: "primary",
    callback: (currentPopup) => {
      // Close the popup when the "Close" button is pressed.
      currentPopup.close();
    }
  }]);
}

function dialogRightWay() {
  currentPopup = WA.ui.openPopup("popup1", 'Da hätten wir die Ärzt:innen, die IT-Techniker:innen und natürlich unsere Schreibkräfte. Deren Büros finden Sie die Hauptgang entlang und dann rechts.', [{
    label: "Danke",
    className: "primary",
    callback: (currentPopup) => {
      // Close the popup when the "Close" button is pressed.
      currentPopup.close();
    }
  }]);
}

function dialogAskWay() {
  currentPopup = WA.ui.openPopup("popup1", 'Wie aufregend!', [{
    label: "Wo finde ich meine Kollegen?",
    className: "primary",
    callback: (currentPopup) => {
      // Close the popup when the "Close" button is pressed.
      currentPopup.close();
      dialogLeftWay();
    }
  },
  {
    label: "Wer ist alles am Schreiben eines Arztbriefs beteiligt?",
    className: "primary",
    callback: (currentPopup) => {
      // Close the popup when the "Close" button is pressed.
      currentPopup.close();
      dialogRightWay();
    }
  }]);
}

function dialogChooseRole() {
  currentPopup = WA.ui.openPopup("popup1", 'Sehr schön. In welchem Bereich arbeiten Sie?', [{
    label: "Informatik",
    className: "primary",
    callback: (currentPopup) => {
      setRole("inf");

      // Close the popup when the "Close" button is pressed.
      currentPopup.close();
      dialogAskWay();
    }
  },
  {
    label: "Medizin",
    className: "primary",
    callback: (currentPopup) => {
      setRole("med");

      // Close the popup when the "Close" button is pressed.
      currentPopup.close();
      dialogAskWay();
    }
  }]);
}

function copyspeicher() {
  //Ablage, nicht ausführen

  currentPopup = WA.ui.openPopup("popup1", 'Willkommen im Hospital, wie kann ich Ihnen weiterhelfen?', [{
    label: "Hallo, mein Name ist " + WA.player.name + ". ich bin wegen der Prozessanalyse hier.",
    className: "primary",
    callback: (currentPopup) => {
      // Close the popup when the "Close" button is pressed.
      currentPopup.close();
    }
  },
  {
    label: "Nope",
    className: "primary",
    callback: (currentPopup) => {
      // Close the popup when the "Close" button is pressed.
      currentPopup.close();
    }
  }]);
}

function setVariables() {
  //sets the initial values/variables as private, world, persitent
  //https://workadventu.re/map-building/api-player.md for public, room, time to live
  WA.player.state.score = 0;
  WA.player.state.role = "noRole";
}

function setRole(newRole: string) {
  var myVariable = WA.player.state.role;
  if (typeof myVariable == "string") {
    WA.player.state.role = newRole;
    console.log("New role: " + WA.player.state.role);
  } else {
    console.log("Error: WA.player.state.role is not a number.");
  }
  scoreAdd(50);
}

function scoreAdd(numberOfPoints: number) {
  var myVariable = WA.player.state.score;
  if (typeof myVariable == "number") {
  WA.player.state.score = myVariable + numberOfPoints;
    console.log(WA.player.state.score + " = new Score");
  } else {
    console.log("Error: WA.player.state.score is not a number.");
  }
}

function closePopup() {
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

//idea:
class NPC {
  name: string;
  opinion: number;

  constructor(myName: string) {
    this.name = myName;
    this.opinion = 0;
  }

  recognizeOneOfUs() {
    
    this.opinion += 20;
  }
}

export {};
