'use strict';

//import queryDb, resetEverything, clearLetterPlaceholders
//export bindButtons, addXLetters
import { queryDb } from './network.js';
import { resetEverything, clearLetterPlaceholders } from './reset.js';

export function bindButtons() {
  //uses: removeLetter, addLetter, queryDb, resetEverything
  let arrowleft = document.getElementById('arrow-left');
  let arrowright = document.getElementById('arrow-right');
  let querydb = document.getElementById('query-db');
  let reseteverything = document.getElementById('reset-everything');

  arrowleft.addEventListener('click', removeLetter);
  arrowright.addEventListener('click', addLetter);
  querydb.addEventListener('click', queryDb);
  reseteverything.addEventListener('click', resetEverything);
}

export function addXLetters(num, str) {
  //uses addLetter
  //used by index.js
  for (let i = 0; i < num; i++) {
    addLetter(str[i]);
  }
}

function addLetter(char = '') {
  //uses: autoTab, clearLetterPlaceholders
  //used by addXLetters, bindButtons
  if (typeof char != 'string') {
    char = '';
  }

  let el = document.createElement('input');
  el.classList.add('letter-square');
  el.setAttribute('placeholder', char);
  el.setAttribute('type', 'text')
  el.setAttribute('maxlength', '1');
  el.oninput = autoTab
  el.onfocus = () => {
    if (el.hasAttribute('placeholder')) {
      clearLetterPlaceholders();
    }
  }
  let letterContainer = document.getElementById('letter-container');
  letterContainer.appendChild(el);
}

function removeLetter() {
  //used by bindButtons
  let letterContainer = document.getElementById('letter-container');
  if (letterContainer.childElementCount > 3) {
    letterContainer.lastChild.remove();
  }
}

function autoTab(e) {
  //used by addLetter
  if (this.value.length == this.getAttribute('maxlength')) {
    if (this.nextElementSibling) {
      this.nextElementSibling.focus();
    }
  }
}