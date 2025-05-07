const register = [];

const registerElements = (elementName) => {
  const element = () => {
    if (elementName[0] === '#') {
      return ['id', elementName.split('#')[1]];
    }
    if (elementName[0] === '.') {
      return ['class', elementName.split('.')[1]];
    }
    return ['tag', elementName];
  }

  const selector = element()[0];
  const name = element()[1];

  if (register[name]) throw Error(`Element ${name} already registered`);
  if (! document.getElementById(name)
    && document.getElementsByClassName(name).length === 0
    && ! document.getElementsByTagName(name)) throw Error(`Element ${name} not found in the DOM`);

  const selected = { element: null };

  if (selector === 'id') selected.element = document.getElementById(name);
  if (selector === 'class') selected.element = document.getElementsByClassName(name);
  if (selector === 'tag') selected.element = document.getElementsByTagName(name)[0];
  register[name] = selected.element;
}

export const setupElements = (elementsNameArray) => {
  if (! Array.isArray(elementsNameArray)) throw Error('elementsNameArray must be an array');
  if (elementsNameArray.length === 0) throw Error('elementsNameArray must not be empty');

  for (let element of elementsNameArray) {
    if (typeof element !== 'string') throw Error('elementsNameArray must only contain strings');
    if (element.length === 0) throw Error('elementsNameArray must not contain empty strings');
    if (element.includes('#') && element.includes('.')) throw Error('elementsNameArray must contain either # or . but not both');
    registerElements(element);
  }
}

export const getRegisteredElements = (elementName) => {
  if (! register[elementName]) {
    throw Error(`Element ${elementName} not registered`);
  }
  return register[elementName];
};
