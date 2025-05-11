import ApiProxy from "./apiProxy.js";
import { loading, userInput } from "./state.js";
import { toggleLoadingMessageAndButton, checkLoading } from "./helpers.js";
import { getRegisteredElements as element } from "./domElementsRegister.js";
import { addPlayerAnswerInputsListeners } from './playerInputs.js';
import { markAnswers } from './answers.js';
import { validateUserInput } from "./inputValidation.js";
import Errors from "./errors.js";

export const sectionTwo = (subject) => {
  try {
    validateUserInput(subject, 'section-two');
    userInput.subject = subject;
  } catch (error) {
    Errors.showModal(error);
  }
}

export const sectionThree = async (subject = null) => {


  try {
    await ApiProxy.getQuestionsAndAnswers(subject, userInput.numberOfQuestions);
  } catch (error) {
    Errors.showModal(error);
  }

  const timer = setInterval(() => {
    checkLoading();
    if (! loading.state) {
      clearInterval(timer);
      toggleLoadingMessageAndButton();
    }
  }, 500);
}

export const sectionFour = (subject = null) => {
  const questions = ApiProxy.result.questions;

  if (! loading.state) {
    const panels = [];

    // Create question panels and hide them apart from the first
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const panel = document.createElement('div');
      panel.classList.add('question-panel');
      if (i > 0) {
        panel.classList.add('hide');
      }
      panel.id = `question-${i+1}`;
      panel.innerHTML = `
         <div class="question-number">${question}</div>
         <div class="answers"><!--Placeholder for players' answers--></div>
          <button class="question-button" data-nextquestion="${i+1}">Next Question</button>
      `;
      panels.push(panel);

      /*
       * Create the answer inputs for the current question
       */
      const answersDiv = panel.querySelector('.answers');
      answersDiv.innerHTML = userInput.players.map(player => `<input type="text" data-playerid="${player.id}" id="question-${i}-player-${player.id}" class="answer-input" placeholder="${player.name}'s answer">`).join('');
    }
    document.getElementById('team-questions').append(...panels);
    addPlayerAnswerInputsListeners(); // Set event listeners for the player answer inputs.
  }

  const questionButtons = document.querySelectorAll('.question-button');
  for (let button of questionButtons) {
    button.addEventListener('click', (e) => {
      const nextQuestion = Number(e.target.dataset.nextquestion) + 1;
      document.getElementById(`question-${nextQuestion}`).classList.remove('hide');
      document.getElementById(`question-${nextQuestion-1}`).classList.add('hide');
    })
  }
}

export const sectionFive = (subject = null) => {
  markAnswers();
};

const sectionSix = (subject = null) => {
  if (! ApiProxy.result.answers || ! ApiProxy.result) alert('Something went wrong. Please refresh the quiz and try again.');
  const listOfAnswers = ApiProxy.result.answers;
  const listsOfPlayersAnswers = [];
  userInput.players.forEach(player => {
   listsOfPlayersAnswers.push(`<h3>${player.name}</h3><ul id="${player.id}-answers-list"></ul>`);
  });

  const answersDiv = document.getElementById('answers');
  listsOfPlayersAnswers.forEach(list => answersDiv.innerHTML += list);

  userInput.players.forEach((player, index) => {
    player.answers.forEach((answer, index) => {
      document.getElementById(`${player.id}-answers-list`).innerHTML +=
        `<li>Question #${index +1}: <ul><li><b>Player answer:</b> ${answer.answerValue} ${answer.answerCorrect ? '<span class="correct-answer">CORRECT</span>' : '<span class="incorrect-answer">INCORRECT</a>'}</li><li><b>Correct answer:</b> ${listOfAnswers[index]}</li></ul></li>`;
    })
  })
}

const sections = {
  'section-two': sectionTwo,
  'section-three': sectionThree,
  'section-four': sectionFour,
  'section-five': sectionFive,
  'section-six': sectionSix,
};

export default sections;
