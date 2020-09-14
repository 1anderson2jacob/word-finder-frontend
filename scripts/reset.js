'use strict';

// export:
// import:

export function clearLetterPlaceholders() {
  //used by addLetter
  let el = document.getElementById('letter-container');
  let children = el.childNodes;

  for (let i = 0; i < children.length; i++) {
    children[i].removeAttribute('placeholder');
  }
}

export function resetEverything() {
  //uses clearLetters, removeList, removeDefinitions
  //used by bindButtons
  document.getElementById('letter-pool').value = '';
  clearLetters();
  removeList();
  removeDefinitions();
}

export function removeList() {
  //used by: resetEverything, displayWords
  let listElement = document.getElementById('list-element');
  if (listElement) {
    listElement.remove();
  }
}

export function removeDefinitions() {
  //used by: queryDb, displayDefinition, resetEverything

  let definitionContainer = document.getElementById('definition-container');

  let noun = document.getElementById('noun');
  let verb = document.getElementById('verb');
  let adverb = document.getElementById('adverb');
  let adjective = document.getElementById('adjective');

  let nounP = document.getElementById('nounP');
  let verbP = document.getElementById('verbP');
  let adverbP = document.getElementById('adverbP');
  let adjectiveP = document.getElementById('adjectiveP');

  definitionContainer.style.display = 'none';

  nounP.innerHTML = '';
  verbP.innerHTML = '';
  adverbP.innerHTML = '';
  adjectiveP.innerHTML = '';

  noun.style.display = 'none';
  verb.style.display = 'none';
  adverb.style.display = 'none';
  adjective.style.display = 'none';
}

function clearLetters() {
  //used by resetEverything
  let el = document.getElementById('letter-container');
  let children = el.childNodes;

  for (let i = 0; i < children.length; i++) {
    children[i].value = '';
  }
}