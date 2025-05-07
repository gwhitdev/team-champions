import { userInput } from "./state.js";
import { jacquardSimilarity } from "./helpers.js";

export const markAnswers = () => {
  userInput.players.map(player => {
    player.answers.forEach((answer,index) => {
      if (jacquardSimilarity(index, new Set(answer.answerValue.toLowerCase())) >= 1) {
        player.answers[index].answerCorrect = true;
        player.score++;
      }
    })
  })
}
