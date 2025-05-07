import { userInput } from "./state.js";
import ApiProxy from "./apiProxy.js";
/*
  Logic to mark the correct answers for each player
 */
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

/*
  Logic to calculate the Jacquard similarity between the user's answer and the correct answer
 */
const jacquardSimilarity = (questionIndex, setA) => {
  const setB = new Set(ApiProxy.result.answers[questionIndex].toLowerCase());
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}
