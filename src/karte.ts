/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { Popup } from "@workadventure/iframe-api-typings";

console.log('Script started successfully');

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    
    //code here
    console.log('test1');
    showScore();
    clock();

    //old/remove
    scoreAdd(3);
    ncp1();

    //variables
    setVariables();


    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

function clock() {
  WA.room.area.onEnter('zoneClock').subscribe(() => {
    console.log('test1');
    const today = new Date();
    const time = today.getHours() + ":" + today.getMinutes();
    currentPopup = WA.ui.openPopup("popupClock", "Es ist " + time, []);
})

WA.room.area.onLeave('zoneClock').subscribe(closePopup)
}

function showScore() {
  //displays current Score as a popup
  WA.room.area.onEnter('zoneScore').subscribe(() => {
    //console.log(WA.player.name, ' entered score zone');
    currentPopup = WA.ui.openPopup("popupScore", "Score: " + WA.player.state.score, []);
  })
}

function ncp1() {
  WA.room.area.onEnter('npc1').subscribe(() => {
    
    console.log("entered npc1 zone");

    let popUp: Popup;

    popUp = WA.ui.openPopup("popup1", 'Willkommen im Hospital, was kann ich für Sie tun?', [{
      label: "Hallo, ich bin wegen der Prozessanalyse hier.",
        className: "primary",
        callback: (popup) => {
            // Close the popup when the "Close" button is pressed.
            popup.close();
        }
    },
    {
      label: "Nope",
        className: "primary",
        callback: (popup) => {
            // Close the popup when the "Close" button is pressed.
            popup.close();
        }
    }]);
  })
  

}

function setVariables() {
  //sets the initial values/variables as private, world, persitent
  //https://workadventu.re/map-building/api-player.md for public, room, time to live
  WA.player.state.score = 0;
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
