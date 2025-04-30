import { buttonToShowQuestions, loadingStatement, startQuizStatement, inputs, symbolsDiv, playersDiv } from "./domElementsRegister.js";
import { loading, userInput, symbols, playerNames } from "./state.js";
import Proxy from "./proxy.js";

export const toggleLoadingMessageAndButton = () => {
  buttonToShowQuestions.classList.remove('hide');
  loadingStatement.classList.add('hide');
  startQuizStatement.classList.remove('hide');
}

/*
  Add the input to an array of names to hold the state
 */
export const detectNewNameInput = () => {
  for (let input of inputs) {
    input.addEventListener('input', (e) => {
      const id = e.target.id.split('-')[1];
      userInput.players[id-1].name = e.target.value ;
    })
  }
}

export const markAnswers = () => {
  userInput.players.map(player => {
    player.answers.forEach((answer,index) => {
      if (jaccardSimilarity(index, new Set(answer.answerValue.toLowerCase())) >= 1) {
        player.answers[index].answerCorrect = true;
        player.score++;
      }
    })
  })
}

export const jaccardSimilarity = (questionIndex, setA) => {
  const setB = new Set(Proxy.result.answers[questionIndex].toLowerCase());
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

export const checkLoading = () => (Proxy.result.questions && Proxy.result.answers) ? loading.state = false : "";

/*
  Logic to print out placeholder symbols to represent the number of players selected
 */
export const createPlayerSymbols = () => {
  if (symbols.length >= 1 && symbols.length <= 10) {
    symbolsDiv.innerHTML = symbols.join('');
  }
}

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

  createPlayerSymbols();
  playersDiv.innerHTML = " "; // Reset the players div to keep the input elements fresh
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

export const addPlayerAnswerInputsListeners = () => {
  const playerAnswerInputs = document.getElementsByClassName('answer-input'); // Select all player answer inputs.
  for (let input of playerAnswerInputs) {
    input.addEventListener('input', (e) => {
      handleAnswerInput(e.target, Number(e.target.dataset.playerid));
    })
  }
}

export const createLeaderBoard = () => {
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
