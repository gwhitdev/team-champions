import { setupElements, getRegisteredElements as element } from "./domElementsRegister.js";
import sections from "./sectionActions.js";
import { handleNumberOfQuestionsButtonsClicked } from "./playerInputs.js";
import Errors from "./errors.js";
import {userInput} from "./state.js";

/*
  Setup the DOM elements
 */
setupElements([
  'body',
  'nav',
  '#modal',
  '#close-nav-button',
  '.next-section-button',
  '#open-nav-button',
  '#section-five-button',
  '#loading-statement',
  '#start-quiz-statement',
  '#inputs',
  '.name-inputs',
  '#subject-input',
  '#number-of-questions-input',
  '.number-of-questions-buttons',
  '#play-again-button'
]);

element('close-nav-button').addEventListener('click', () => {
  element('nav').classList.add('hide');
  element('nav').classList.remove('show-nav');
  element('body').classList.remove('stop-scrolling');
});

element('open-nav-button').addEventListener('click', () => {
  element('nav').classList.remove('hide');
  element('nav').classList.add('show-nav');
  element('body').classList.add('stop-scrolling');
});

element('play-again-button').addEventListener('click', () => {
  window.location = '/'; // Refresh the page.
})

for (let button of element('next-section-button')) {
  button.addEventListener('click', (e) => {
    const nextSection = e.target.dataset.next;
    try {
      const subject = element('subject-input').value
      if (Object.keys(sections).includes(nextSection)) sections[nextSection](subject); // Call the section action function.

      document.getElementById(nextSection).classList.remove('hide');
      document.getElementById(nextSection).classList.add('show');

      if (! Errors.present) window.location = `#${nextSection}`; // If no errors, go to the next section.
    } catch (error) {
      Errors.showModal(error)
    }
  })
}

for (let button of element('number-of-questions-buttons')) {
  button.addEventListener('click', (e) => {
    handleNumberOfQuestionsButtonsClicked(e.target.id);
  })
}
