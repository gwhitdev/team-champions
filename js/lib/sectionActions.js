import Proxy from "./proxy.js";
import { loading, userInput } from "./state.js";
import { toggleLoadingMessageAndButton, markAnswers, createLeaderBoard, addPlayerAnswerInputsListeners, detectNewNameInput, checkLoading } from "./helpers.js";
import { getRegisteredElements as element } from "./domElementsRegister.js";

export const sectionTwo = async (subject) => Proxy.getQuestionsAndAnswers(subject);
export const sectionThree = (subject = null) => detectNewNameInput(); // Detect if the current section is section three and the re-populate inputs with already entered names

export const sectionFour = (subject = null) => {
  const timer = setInterval(() => {
    checkLoading();
    if (! loading.state) {
      clearInterval(timer);
      toggleLoadingMessageAndButton();
    }
  }, 500);
}

export const sectionFive = async (subject = null) => {
  const questions = await Proxy.result.questions;

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

export const sectionSix = (subject = null) => {
  markAnswers();
  createLeaderBoard();
  const congratsElement = document.getElementById('modal-body')
  element('modal').classList.add('show');
  element('body').classList.add('stop-scrolling');
  const timeLeft = {seconds: 4};
  const countdown = document.getElementById('countdown');

  const interval = setInterval(() => {
    countdown.innerText = String(--timeLeft.seconds);
    if (timeLeft.seconds === 0) {
      countdown.innerText = "";
      countdown.classList.add('hide')
      clearInterval(interval)
    }
  },1000)

  setTimeout(() => {
    congratsElement.classList.remove('hide');
  },4000)
};

const sections = {
  'section-two': sectionTwo,
  'section-three': sectionThree,
  'section-four': sectionFour,
  'section-five': sectionFive,
  'section-six': sectionSix,
};

export default sections;
