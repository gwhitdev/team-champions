import { symbols } from "./state.js";
import { getRegisteredElements as element } from "./domElementsRegister.js";

/*
  Logic to print out placeholder symbols to represent the number of players selected
 */
export const createPlayerSymbols = () => {
  if (symbols.length >= 1 && symbols.length <= 10) {
    element('symbols').innerHTML = symbols.join('');
  }
}
