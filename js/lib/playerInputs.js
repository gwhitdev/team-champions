import { userInput } from "./state.js";
import { getRegisteredElements as element } from "./domElementsRegister.js";
import { validateUserInput } from "./inputValidation.js";
import Errors from "./errors.js";

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
