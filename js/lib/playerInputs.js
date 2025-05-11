import { userInput, playerNames, symbols } from "./state.js";
import { getRegisteredElements as element } from "./domElementsRegister.js";
import { createPlayerSymbols } from "./playerSymbols.js";
import { validateUserInput } from "./inputValidation.js";
import Errors from "./errors.js";

/*
  Detect and react to the number of players selected by the user
 */
export const handleNumOfPlayersButtons = (eventTarget) => {
  if (eventTarget.id === "more" && userInput.numberOfPlayers < 10) {
    userInput.numberOfPlayers = ++userInput.numberOfPlayers;
    symbols.push("🚹");
  }

  if (eventTarget.id === "less" && userInput.numberOfPlayers >= 2 && userInput.numberOfPlayers <= 10) {
    userInput.numberOfPlayers = --userInput.numberOfPlayers;
    symbols.pop();
  }
  userInput.players = userInput.players.slice(0, userInput.numberOfPlayers);
  createPlayerSymbols();
  element('inputs').innerHTML = " "; // Reset the player name inputs to stop duplication
  createNewPlayerInputs();
}

/*
  Reactively create input text boxes that are styled to match the page when the user amends the number of players.
  This also maintains any previously entered names for if or when the user changes the number of players.
 */
export const createNewPlayerInputs = () => {
  for (let i = 0; i < userInput.numberOfPlayers; i++) {
    const player = document.createElement('input');
    const num = i+1;
    player.id = `player-${num}`;
    player.placeholder = `Player ${num}'s name`;
    player.classList.add('workbench');
    player.classList.add('name-inputs');
    player.dataset.id = `${num}`;
    if (playerNames[i]) {
      player.value = playerNames[i]; // Ensure player name input keeps last entered name if number of players changes
    }
    element('inputs').appendChild(player);
    userInput.players[i] = {
      id: num,
      name: player.placeholder,
      answers: [],
      score: 0
    }
  }
}

/*
  Handle updating the state of the answers for each player when the user enters an answer.
 */
function handleAnswerInput(answerInput, playerId){
  const foundUser = userInput.players[playerId-1];

  if (foundUser.answers[answerInput.id.split('-')[1]]) {
    try {
      validateUserInput(answerInput.value, 'section-three');
      foundUser.answers[answerInput.id.split('-')[1]].answerValue = answerInput.value;
    } catch (error) {
      Errors.showModal(error);
    }
  } else {
    try {
      validateUserInput(answerInput.value, 'section-three');
      foundUser.answers.push({
        answerValue: answerInput.value,
        answerCorrect: null
      });
    } catch (error) {
      Errors.showModal(error);
    }
  }
}

export const addPlayerAnswerInputsListeners = () => {
  const playerAnswerInputs = document.getElementsByClassName('answer-input'); // Select all player answer inputs.
  for (let input of playerAnswerInputs) {
    try {
      validateUserInput(input.value, 'section-five');
      input.addEventListener('input', (e) => {
        handleAnswerInput(e.target, Number(e.target.dataset.playerid));
      })
    } catch (error) {
      Errors.showModal(error);
    }
  }
}
