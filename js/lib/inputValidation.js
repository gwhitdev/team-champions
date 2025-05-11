
/*
  Logic to validate user input
 */
export const validateUserInput = (inputText, inputSection) => {
  const characterWhiteList = /^[a-zA-Z0-9 ]*$/;
  if (inputText.match(characterWhiteList) === null) throw Error('Please do not use special characters including spaces.');
  if (inputText.length > 30) throw Error('Please enter a value less than 100 characters');
  if (inputText.length < 3) throw Error('Please enter a value greater than 3 characters');
}
