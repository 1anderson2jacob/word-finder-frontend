'use strict';

function addLetter(char = '') {
  let el = document.createElement('input');
  el.classList.add('letter-square');
  el.setAttribute('placeholder', char);
  el.setAttribute('type', 'text')
  el.setAttribute('maxlength', '1');
  el.oninput = autoTab
  el.onfocus = () => {
    el.removeAttribute('placeholder');
  }
  let letterContainer = document.getElementById('letter-container');
  letterContainer.appendChild(el);
}

function addXLetters(num, str) {
  for (let i = 0; i < num; i++) {
    addLetter(str[i]);
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
  if (this.value.length == this.getAttribute('maxlength')) {
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
  let wordsList = removeExtraWords(data);
  let listElement = document.createElement('ul');

  listElement.setAttribute('id', 'list-element');
  resultsContainer.appendChild(listElement);

  //for each word in wordlist
  for (let word of wordsList) {
    let wordElement = document.createElement('li')
    wordElement.innerHTML = word + '  ';
    listElement.appendChild(wordElement);
  }

};

function removeExtraWords(data) {
  let letterPool = document.getElementById('letter-pool').value;
  let wordsArr = [];
  let prunedWordsArr = [];
  let regex = new RegExp('\\b[' + letterPool + ']+\\b', 'i')

  for (let index of data) {
    wordsArr.push(index.word);
  }

  for (let i in wordsArr) {
    // console.log(wordsArr[i].match(regex));
    if (regex.test(wordsArr[i])) {
      prunedWordsArr.push(wordsArr[i]);
    }
  }
  console.log(prunedWordsArr)
  prunedWordsArr = removeDupes(prunedWordsArr, letterPool);
  return prunedWordsArr;
}

function removeList() {
  let listElement = document.getElementById('list-element');
  if (listElement) {
    listElement.remove();
  }
}

function resetEverything() {
  document.getElementById('letter-pool').value = '';
  clearLetters();
  removeList();
}

function clearLetters() {
  let el = document.getElementById('letter-container');
  let children = el.childNodes;

  for (let i = 0; i < children.length; i++) {
    children[i].value = '';
  }
}

function removeDupes(wordList, wordPool) {
  let poolObj = {}
  let wordListObj = {};
  let arr = [];
  // push letterpool to an object
  poolObj = count(wordPool);

  for (let i = 0; i < wordList.length; i++) {
    // push prunedWordsList to an object
    wordListObj = count(wordList[i]);
    // console.log(wordListObj)
    if (containsKeyValues(poolObj, wordListObj)) {
      arr.push(wordList[i]);
    }

  }

  return arr;
}

function count(str) {
  //takes a string and returns an object. each key is a letter; each value is the number of each of those letters
  let obj = {}
  let letter = '';
  for (let i = 0; i < str.length; i++) {

    letter = str[i];
    if (obj.hasOwnProperty(letter)) {
      obj[letter] = obj[letter] + 1;

    } else {
      obj[letter] = 1;
    }

  }

  return obj;
}

function containsKeyValues(obj1, obj2) {
  //obj1: poolObj
  //obj2: wordsListObj
  //checks to see if obj2 has at least as many vals for each of its keys as obj1

  for (let key in obj2) {
    // for (let key in obj1) {
    if (!(obj2[key] <= obj1[key])) {

      return false;
    }
  }
  return true;
}

// function clearLetters() {
//   // changeLetterSquares('value', '');
// }

// function changeLetterSquares(attr, val) {
//   let el = document.getElementById('letter-container');
//   let children = el.childNodes;
//   for (let i = 0; i < children.length; i++) {
//     children[i].attr = val;
//   }
// }
