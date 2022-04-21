// Global Constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
//Global Variables
var clueHoldTime = 1000; // light and sound time in miliseconds
var pattern = [1, 2, 1, 5, 2, 4];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; // must be between 0.0 and 1.0
var guessCounter = 0;
var mistakes = 3;
var time = 10;

function startGame() {
  //initialize game variables
  for (let i = 0; i < pattern.length; i++) {
    pattern[i] = random(1, 8);
  }
  progress = 0;
  gamePlaying = true;
  mistakes = 3;
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
  clearInterval(myInterval);
  time = 10;
  myInterval = setInterval(timer, 1000);
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function stopGame() {
  //initialize game variables
  // swap the Start and Stop buttons
  clearInterval(myInterval);
  time = 10;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  document.getElementById("timer").classList.add("hidden");
  // set clueholdtime back to orginal
  clueHoldTime = 1000;
}

// btn = number of button
function lightButton(btn) {
  document.getElementById("Btn" + btn).classList.add("lit");
}
// btn = number of button
function clearButton(btn) {
  document.getElementById("Btn" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playMyAudio();
    // setTimeout(function used in future,
    // amount of time delay, argument needed for first parameter function)
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  context.resume();
  let delay = nextClueWaitTime; //set delay to initial wait time
  guessCounter = 0;
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
    clueHoldTime -= 35;
  }
}

function loseGame() {
  clearInterval(myInterval);
  stopGame();
  alert("Game Over. You lost.");
}

function winGame() {
  stopGame();
  alert("Game Over. You Won!");
}

function guess(btn) {
  console.log("user guessed: " + btn);
  var endOfGame = pattern.length - 1;
  if (!gamePlaying) {
    return;
  }
  // user selects wrong answer game over
  if (pattern[guessCounter] != btn) {
    mistakes--;
    alert("Wrong Choice! you have " + mistakes + " chances left.");
    if (mistakes == 0) {
      loseGame();
    }
  }
  // user is correct continue
  else {
    // turn is over
    if (guessCounter == progress) {
      // this is last turn
      if (progress == endOfGame) {
        winGame();
      } else {
        // increment progress, play next sequence
        progress++;
        playClueSequence();
        clearInterval(myInterval);
        time = 10 + progress;
        myInterval = setInterval(timer, 1000);
      }
    }
    // turn is not over continue guessing
    else {
      // increment guess counter
      guessCounter++;
    }
  }
}
// // display timer
var myInterval;
function timer() {
  document.getElementById("timer").classList.remove("hidden");
  if (time >= 0) document.getElementById("timer").innerHTML = time--;
  else {
    gamePlaying = false;
    loseGame();
  }
}

function playMyAudio() {
  document.getElementById("cardFlipSound").play();
}
// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);