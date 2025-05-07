import { loading } from "./state.js";
import Proxy from "./proxy.js";
import { getRegisteredElements as element } from "./domElementsRegister.js";

/*
  Logic to toggle the loading message and button
 */
export const toggleLoadingMessageAndButton = () => {
  element('section-five-button').classList.remove('hide');
  element('loading-statement').classList.add('hide');
  element('start-quiz-statement').classList.remove('hide');
}

/*
  Logic to calculate the Jacquard similarity between the user's answer and the correct answer
 */
export const jacquardSimilarity = (questionIndex, setA) => {
  const setB = new Set(Proxy.result.answers[questionIndex].toLowerCase());
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

export const checkLoading = () => (Proxy.result.questions && Proxy.result.answers) ? loading.state = false : "";
