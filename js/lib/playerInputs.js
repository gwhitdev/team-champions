import { userInput } from "./state.js";
import { getRegisteredElements as element } from "./domElementsRegister.js";
import { validateUserInput } from "./inputValidation.js";
import Errors from "./errors.js";

/*
Handle the number of questions buttons clicked.
 */
export const handleNumberOfQuestionsButtonsClicked = (buttonId) => {
  /* Check if the user is trying to go above 10 questions */
  if (buttonId === 'more' && userInput.numberOfQuestions === 10) {
    Errors.showModal({'message': 'You cannot go above 10 questions'});
  }

  /* Check if the user is trying to go below 1 question */
  if (buttonId === 'less' && userInput.numberOfQuestions === 1) {
    Errors.showModal({'message': 'You cannot go below 1 question'});
  }

  /* Update the number of questions */
  if (buttonId === 'more' && userInput.numberOfQuestions < 10) {
    ++userInput.numberOfQuestions;
  }

  /* Update the number of questions */
  if (buttonId === 'less' && userInput.numberOfQuestions > 1) {
    --userInput.numberOfQuestions;
  }

  /* Update the number of questions on the page */
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
    let timeoutId = null;

    try {
      input.addEventListener('input', (e) => {

        if (timeoutId) clearTimeout(timeoutId); // Clear the timeout if it exists.

        timeoutId = setTimeout(() => {
          handleAnswerInput(e.target, Number(e.target.dataset.playerid)); // Call the handleAnswerInput function to validate the input after debouncing
        }, 3000)

      })
    } catch (error) {
      Errors.showModal(error);
    }
  }
}
