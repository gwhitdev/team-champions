import { userInput } from './state.js';
/*
  Logic to handle errors
 */
const Errors = {
  errorsList: document.getElementById('errors-list'),
  errorsModal: document.getElementById('errors-modal'),
  /*
  * Add an error to the state and create a list item to display it on the page.
   */
  add(error) {
    userInput.errors.push(error.message);
    this.createErrorMessage(error.message)
  },
  /*
  * Create a list item to display an error on the page.
   */
  createErrorMessage(message) {
    const item = document.createElement('li');
    item.innerHTML = `<p>${message}</p>`;
    this.errorsList.appendChild(item);
  },
  /*
  * Clear the errors list and the state.
   */
  clear() {
    this.errorsList.innerHTML = "";
    userInput.errors = [];
  },
  /*
  * Show the errors modal and hide it after 3 seconds.
   */
  showModal(message) {
    this.add(message);
    this.errorsModal.classList.remove('hide');
    setTimeout(() => {
      this.errorsModal.classList.add('hide');
      this.clear();
    },3000)
  }
}

export default Errors;
