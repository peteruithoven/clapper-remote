import "./style.css";

let state;
const STATES = {
  PAUSED: 2,
  PLAYING: 3,
};
let connectionError = false;

const playButton = document.querySelector("#play");
const pauseButton = document.querySelector("#pause");
const alertIcon = document.querySelector("#alert");

// const socket = new WebSocket('ws://localhost:6446/websocket');
const socket = new WebSocket("ws://192.168.178.144:6446/websocket");
// Supported actions:
// https://github.com/Rafostar/clapper/blob/master/src/player.js/#L360
// Websocket test page
// https://livepersoninc.github.io/ws-test-page/

socket.addEventListener("open", () => {
  console.log("open");
  updateUI();
});

socket.addEventListener("error", (event) => {
  console.log("error");
  connectionError = true;
  updateUI();
});

playButton.addEventListener("click", () => {
  socket.send(JSON.stringify({ action: "play" }));
});

pauseButton.addEventListener("click", () => {
  socket.send(JSON.stringify({ action: "pause" }));
});

socket.addEventListener("message", (event) => {
  const response = JSON.parse(event.data);
  switch (response.action) {
    case "state_changed":
      state = response.value;
      console.log("state: ", state, getKeyByValue(STATES, state));
      break;
  }
  updateUI();
});

function updateUI() {
  alertIcon.classList.toggle("hidden", !connectionError);
  playButton.classList.toggle(
    "hidden",
    connectionError || state === STATES.PLAYING
  );
  pauseButton.classList.toggle(
    "hidden",
    connectionError || state === STATES.PAUSED
  );
}

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}
