import {
  body,
  nav,
  modal,
  playerButtons,
  closeNavButton,
  closeModalButton,
  sectionButtons,
  openNavButton,
} from './domElementsRegister.js';
import { createNewPlayerInputs, handleNumOfPlayersButtons } from "./helpers.js";

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

sectionButtons.forEach(button => {
  import sections from "./sectionActions.js";

  button.addEventListener('click', (e) => {
    const nextSection = e.target.dataset.next;
    const subject = {subject: ''}

    if (nextSection === 'section-two') subject.subject = document.getElementById('subject-input').value;
    if (Object.keys(sections).includes(nextSection)) sections[nextSection](subject.subject);

    document.getElementById(nextSection).classList.remove('hide');
    document.getElementById(nextSection).classList.add('show');

    window.location = `#${nextSection}`; // Move the user to the next section as defined above
  })
});

/*
  When the user changes the number of players the number of player symbols needs to change.
  This handles the change of state and prints it to the page.
 */
for (let button of playerButtons) button.addEventListener('click', e => handleNumOfPlayersButtons(e.target));

/*
  When the DOM has finished loading automatically create the first player name input.
 */
document.addEventListener('DOMContentLoaded', () => createNewPlayerInputs());
