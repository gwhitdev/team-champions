import { userInput } from "./state.js";
import { getRegisteredElements as element } from "./domElementsRegister.js";
import { validateUserInput } from "./inputValidation.js";
import Errors from "./errors.js";

/*
Handle the number of questions buttons clicked.
 */
export const handleNumberOfQuestionsButtonsClicked = (event) => {
  /* Update the number of questions */
  if (event.target.id === 'more' && userInput.numberOfQuestions < 10) {
    ++userInput.numberOfQuestions;
  }

  /* Check if the user is trying to go above 10 questions */
  if (event.target.id === 'more' && userInput.numberOfQuestions === 10) {
    Errors.showModal({'message': 'You cannot go above 10 questions'});
  }

  /* Check if the user is trying to go below 1 question */
  if (event.target.id === 'less' && userInput.numberOfQuestions === 1) {
    Errors.showModal({'message': 'You cannot go below 1 question'});
  }

  /* Update the number of questions */
  if (event.target.id === 'less' && userInput.numberOfQuestions > 1) {
    --userInput.numberOfQuestions;
  }

  element('number-of-questions-input').innerText = userInput.numberOfQuestions;
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
