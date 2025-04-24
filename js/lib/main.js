import proxy from './proxy.js';

/*
  Setup initial state
  */
const userInput = {numberOfPlayers: 1, players:[
    {id: 1, name: 'Player 1'}
  ]};
const playerNames = [];
const winner = {id: null};
const symbols = ["🚹"];

/*
  Get key elements that will display in a reactive way
 */
const number = document.querySelector('#number-of-players');
const playersDiv = document.querySelector('#inputs');
const symbolsDiv = document.getElementById('symbols');
const inputs = document.getElementsByClassName('inputs');
const playerButtons = document.getElementsByClassName('numOfPlayersButtons');
const sectionButtons = document.querySelectorAll('.next-section-button');
const modal = document.getElementById('modal');
const body = document.getElementsByTagName('body')[0];
const closeModalButton = document.getElementById('close-modal');
const openNavButton = document.getElementById('open-nav');
const nav = document.getElementsByTagName('nav')[0];
const closeNavButton = document.getElementById('close-nav');

closeNavButton.addEventListener('click', () => {
  nav.classList.add('hide');
  nav.classList.remove('show-nav')
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

const sectionTwo = (subject) => {
  proxy.getQuestionsAndAnswers(subject)
}

const sectionThree = (subject = null) => {
  // Detect if the current section is section three and the re-populate inputs with already entered names
  // for consistency if the user changes the number of players.
  detectNewNameInput()
};

const sectionSix = (subject = null) => {
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

const sections = {
  'section-two': sectionTwo,
  'section-three': sectionThree,
  'section-six': sectionSix
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
  Add the inputted to an array of names to hold the state
 */
function detectNewNameInput() {
  for (let input of inputs) {
    console.log(input)
    input.addEventListener('input', (e) => {
      const id = e.target.id.split('-')[1];
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
  createNewPlayerInputs()

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
  }
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
