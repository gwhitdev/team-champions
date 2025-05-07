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

export const checkLoading = () => (Proxy.result.questions && Proxy.result.answers) ? loading.state = false : "";
