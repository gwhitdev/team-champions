import Proxy from './proxy.js';
import {
  body,
  nav,
  inputs,
  playersDiv,
  symbolsDiv,
  number,
  modal,
  playerButtons,
  closeNavButton,
  closeModalButton,
  sectionButtons,
  startQuizStatement,
  buttonToShowQuestions,
  loadingStatement,
  openNavButton,
} from './domElementsRegister';

/*
  Setup initial state
 */
const userInput = {
  numberOfPlayers: 1,
  players: [
    {
      id: 1,
      name: 'Player 1'
    }
  ]
};
const playerNames = [];
const winner = {id: null};
const symbols = ["🚹"];

closeNavButton.addEventListener('click', () => {
  nav.classList.add('hide');
  nav.classList.remove('show-nav');
  body.classList.remove('stop-scrolling');
});

openNavButton.addEventListener('click', () => {
  nav.classList.remove('hide');
  nav.classList.add('show-nav');
  body.classList.add('stop-scrolling');
})

closeModalButton.addEventListener('click', () => {
  modal.classList.add('hide');
  modal.classList.remove('show');
  body.classList.remove('stop-scrolling');
});

const sectionTwo = async (subject) => {
  Proxy.getQuestionsAndAnswers(subject)
}

const sectionThree = (subject = null) => {
  /*
    Detect if the current section is section three and the re-populate inputs with already entered names
   */
  detectNewNameInput()
};

const state = {loading: true};
function checkLoading() {
  if (Proxy.result.questions && Proxy.result.answers) state.loading = false;
}

const sectionFour = (subject = null) => {
  function toggleLoadingMessageAndButton() {
    buttonToShowQuestions.classList.remove('hide');
    loadingStatement.classList.add('hide');
    startQuizStatement.classList.remove('hide');
  }

  const timer = setInterval(() => {
    checkLoading();
    if (!state.loading) {
      clearInterval(timer);
      toggleLoadingMessageAndButton()
    }
  }, 500);
}

const sectionFive = async (subject = null) => {
  const questions = await Proxy.result.questions;

  if (! state.loading) {
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

const sectionSix = (subject = null) => {
  markAnswers();
  createLeaderBoard();
  const congratsElement = document.getElementById('modal-body')
  modal.classList.add('show');
  body.classList.add('stop-scrolling');
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

function jaccardSimilarity(questionIndex, setA) {
  const setB = new Set(Proxy.result.answers[questionIndex].toLowerCase());
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  console.log(intersection.size / union.size);
  return intersection.size / union.size;
}


const markAnswers = () => {
  userInput.players.map(player => {
    player.answers.forEach((answer,index) => {
      if (jaccardSimilarity(index, new Set(answer.answerValue.toLowerCase())) >= 1) {
        player.answers[index].answerCorrect = true;
        player.score++;
      }
    })
  })
  console.log(userInput.players);
}

const sections = {
  'section-two': sectionTwo,
  'section-three': sectionThree,
  'section-four': sectionFour,
  'section-five': sectionFive,
  'section-six': sectionSix,
};

sectionButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const nextSection = e.target.dataset.next;
    const subject = {subject: ''}
    if (nextSection === 'section-two') {
      subject.subject = document.getElementById('subject-input').value;
      console.log('subject: ', subject.subject)
    }

    if (Object.keys(sections).includes(nextSection)) {
      sections[nextSection](subject.subject);
    }

    document.getElementById(nextSection).classList.remove('hide');
    document.getElementById(nextSection).classList.add('show');

    window.location = `#${nextSection}`; // Move the user to the next section as defined above
  })
});

/*
  Logic to print out placeholder symbols to represent the number of players selected
 */
function createPlayerSymbols() {
  if (symbols.length >= 1 && symbols.length <= 10) {
    symbolsDiv.innerHTML = symbols.join('');
  }
}

/*
  Add the input to an array of names to hold the state
 */
function detectNewNameInput() {
  for (let input of inputs) {
    input.addEventListener('input', (e) => {
      const id = e.target.id.split('-')[1];
      userInput.players[id-1].name = e.target.value ;
      playerNames[id-1] = e.target.value;
    })
  }
}

/*
  Detect and react to the number of players selected by the user
 */
function handleNumOfPlayersButtons(eventTarget) {
  if (eventTarget.id === "more" && userInput.numberOfPlayers < 10) {
    userInput.numberOfPlayers = ++userInput.numberOfPlayers;
    symbols.push("🚹");
  }

  if (eventTarget.id === "less" && userInput.numberOfPlayers >= 2 && userInput.numberOfPlayers <= 10) {
    userInput.numberOfPlayers = --userInput.numberOfPlayers;
    symbols.pop();
  }

  createPlayerSymbols();
  playersDiv.innerHTML = " "; // Reset the players div to keep the input elements fresh
  createNewPlayerInputs();
}

/*
  Reactively create input text boxes that are styled to match the page when the user amends the number of players.
  This also maintains any previously entered names for if or when the user changes the number of players.
 */
function createNewPlayerInputs() {
  for (let i = 0; i < userInput.numberOfPlayers; i++) {
    const player = document.createElement('input');
    const num = i+1;
    player.id = `player-${num}`;
    player.placeholder = `Player ${num}'s name`;
    player.classList.add('workbench');
    player.classList.add('inputs');
    player.dataset.id = `${num}`;
    if (playerNames[i]) {
      player.value = playerNames[i]; // Ensure player name input keeps last entered name if number of players changes
    }
    playersDiv.appendChild(player);
    userInput.players[i] = {
      id: num,
      name: player.placeholder,
      answers: [],
      score: 0
    }
  }
}

/*
  Reactively update the state of the answers for each player when the user enters an answer.
 */
function handleAnswerInput(answerInput, playerId){
  const foundUser = userInput.players[playerId-1];
  if (foundUser.answers.length > 0) {
    foundUser.answers[answerInput.id.split('-')[1]].answerValue = answerInput.value;
  } else {
    foundUser.answers.push({
      answerValue: answerInput.value,
      answerCorrect: null
    });
  }
}

function addPlayerAnswerInputsListeners() {
  const playerAnswerInputs = document.getElementsByClassName('answer-input'); // Select all player answer inputs.
  for (let input of playerAnswerInputs) {
    input.addEventListener('input', (e) => {
      handleAnswerInput(e.target, Number(e.target.dataset.playerid));
    })
  }
}

function createLeaderBoard() {
  const scores = [];
  userInput.players.forEach(player => {
    scores.push({
      playerId: player.name,
      score: player.score
    });
  })
  scores.sort((a,b) => b.score - a.score);
  const board = document.createElement('ul');
  scores.forEach((score, index) => {
    const li = document.createElement('li');
    li.innerText = `${index+1}. ${score.playerId} - ${score.score}`;
    board.appendChild(li);
  })
  document.getElementById('leaderboard').appendChild(board);
}
/*
  When the user changes the number of players the number of player symbols needs to change.
  This handles the change of state and prints it to the page.
 */
for (let button of playerButtons) {
  button.addEventListener('click', e => handleNumOfPlayersButtons(e.target));
}

/*
  When the DOM has finished loading automatically create the first player name input.
 */
document.addEventListener('DOMContentLoaded', () => {
  createNewPlayerInputs();
});
