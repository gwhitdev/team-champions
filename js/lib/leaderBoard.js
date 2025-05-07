import { userInput } from "./state.js";

/*
Create the leader board
 */
export const createLeaderBoard = () => {
  const scores = [];

  userInput.players.forEach(player => {
    scores.push({
      playerId: player.name,
      score: player.score
    });
  })

  scores.sort((a,b) => b.score - a.score); // Sort the scores in descending order

  const board = document.createElement('ul');

  /* Create the list items for the leader board */
  scores.forEach((score, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="question-number-marker">${index+1}.</span> ${score.playerId} - <span class="score">Score: ${score.score}</span>`;
    board.appendChild(li);
  })

  document.getElementById('leaderboard').appendChild(board); // Append the leader board to the DOM
}
