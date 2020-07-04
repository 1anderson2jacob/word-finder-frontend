'use strict';

function addLetter() {
  let inputLetterSquare = document.createElement('input');
  inputLetterSquare.classList.add('letter-square');
  inputLetterSquare.innerHTML = '';
  inputLetterSquare.setAttribute('type', 'text')
  inputLetterSquare.setAttribute('maxlength', '1');
  inputLetterSquare.addEventListener('keyup', autoTab);
  let letterContainer = document.getElementById('letter-container');
  letterContainer.appendChild(inputLetterSquare);
}

function addXLetters(num) {
  for (let i = 0; i < num; i++) {
    addLetter();
  }
}

function removeLetters() {
  let letterContainer = document.getElementById('letter-container');
  if (letterContainer.childElementCount > 3) {
    letterContainer.lastChild.remove();
  }
}

function squareValue(e) {
  console.log(this.innerText)
}

function autoTab(e) {
  if (e.keyCode === 8) {
    if (this.previousElementSibling) {
      this.previousElementSibling.focus();
    }

  }
  else {
    if (this.nextElementSibling) {
      this.nextElementSibling.focus();
    }
  }
}

function combineInputs() {
  let wordString = '';
  const letters = /^[A-Za-z]+$/;
  let letterChildren = document.getElementById('letter-container').children;

  for (let i = 0; i < letterChildren.length; i++) {
    if (!letterChildren[i].value.match(letters)) {
      wordString += '_';
    } else {
      wordString += letterChildren[i].value;
    }
  }

  let queryObj = {
    incompleteWord: wordString,
  }

  return Object.keys(queryObj).map(key => key + '=' + queryObj[key]).join('&');
}

function queryDb() {
  let queryUrl = combineInputs();

  async function getWords() {
    let res = await fetch('https://word-finder-backend.herokuapp.com/' + '?' + queryUrl);
    let data = await res.json();
    return data;
  }

  getWords().then(data => displayWords(data));
}

function displayWords(data) {
  //delete listElement if there is one
  removeList();

  let resultsContainer = document.getElementById('results-container');
  let wordsList = eliminateExtraWords(data);
  let listElement = document.createElement('ul');

  listElement.setAttribute('id', 'list-element');
  resultsContainer.appendChild(listElement);

  //for each word in wordlist
  for (let word of wordsList) {
    let wordElement = document.createElement('li')
    wordElement.innerHTML = word + '  ';
    listElement.appendChild(wordElement);
  }

  let wordElement = document.createElement('li')
  listElement.appendChild(wordElement);

};

function eliminateExtraWords(data) {
  let letterPool = document.getElementById('letter-pool').value;
  let wordsArr = [];
  let prunedWordsArr = [];
  let regex = new RegExp('([^' + letterPool + '])', 'gi')

  for (let index of data) {
    wordsArr.push(index.word);
  }

  for (let i in wordsArr) {
    if (!wordsArr[i].match(regex)) {
      prunedWordsArr.push(wordsArr[i]);
    }
  }

  return prunedWordsArr;
}

function removeList() {
  let listElement = document.getElementById('list-element');
  if (listElement) {
    listElement.remove();
  }
}