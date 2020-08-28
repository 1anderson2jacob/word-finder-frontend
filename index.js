'use strict';

function addLetter(char = '') {
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
  wordString = wordString.toLowerCase();
  let queryObj = {
    incompleteWord: wordString,
  }

  return Object.keys(queryObj).map(key => key + '=' + queryObj[key]).join('&');
}

function queryDb() {
  removeDefinitions();

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

  //event delegation on UL so that LI clicks call queryTwinWord
  listElement.addEventListener('click', (e) => {
    if (e.target && e.target.nodeName == "LI") {
      queryTwinWord(e.target.innerHTML);
    }
  });
  listElement.setAttribute('id', 'list-element');
  resultsContainer.appendChild(listElement);

  //for each word in wordlist
  for (let word of wordsList) {
    let wordElement = document.createElement('li')
    wordElement.innerHTML = word;
    listElement.appendChild(wordElement);
  }

};

function removeExtraWords(data) {
  let letterPool = document.getElementById('letter-pool').value.toLowerCase();
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
  removeDefinitions();
}

function clearLetters() {
  let el = document.getElementById('letter-container');
  let children = el.childNodes;

  for (let i = 0; i < children.length; i++) {
    children[i].value = '';
  }
}

function clearLetterPlaceholders() {
  let el = document.getElementById('letter-container');
  let children = el.childNodes;

  for (let i = 0; i < children.length; i++) {
    children[i].removeAttribute('placeholder');
  }
}

function removeDefinitions() {
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

function queryTwinWord(word) {

  async function getDefinition() {
    let res = await fetch('https://twinword-word-graph-dictionary.p.rapidapi.com/definition/?entry=' + word, {
      'method': 'GET',
      'headers': {
        'x-rapidapi-host': 'twinword-word-graph-dictionary.p.rapidapi.com',
        'x-rapidapi-key': 'dd4036dfc4msh04b02a30e274f1bp1d5043jsnbc4b70b6dd41'
      }
    })
    let data = await res.json();
    return data;
  }

  getDefinition().then(data => displayDefinition(data.meaning))
}


function displayDefinition(definitions) {
  removeDefinitions();

  if (!definitions) {
    return;
  }

  let definitionContainer = document.getElementById('definition-container');
  definitionContainer.style.display = 'block';

  if (definitions.noun) {
    let noun = document.getElementById('noun');
    let p = document.getElementById('nounP');

    let i = 0;
    let regex = /\(nou\)/gi;
    const str = definitions.noun.replace(regex, () => {
      i++;
      return (i + '  ');
    });

    noun.style.display = 'inline-block';
    p.innerHTML = str;

  }

  if (definitions.verb) {
    let verb = document.getElementById('verb');
    let p = document.getElementById('verbP');

    let i = 0;
    let regex = /\(vrb\)/gi;
    const str = definitions.verb.replace(regex, () => {
      i++;
      return (i + '  ');
    });

    verb.style.display = 'inline-block';
    p.innerHTML = str;

  }

  if (definitions.adverb) {
    let adverb = document.getElementById('adverb');
    let p = document.getElementById('adverbP');

    let i = 0;
    let regex = /\(adv\)/gi;
    const str = definitions.adverb.replace(regex, () => {
      i++;
      return (i + '  ');
    });

    adverb.style.display = 'inline-block';
    p.innerHTML = str;

  }

  if (definitions.adjective) {
    let adjective = document.getElementById('adjective');
    let p = document.getElementById('adjectiveP');

    let i = 0;
    let regex = /\(adj\)/gi;
    const str = definitions.adjective.replace(regex, () => {
      i++;
      return (i + '  ');
    });

    adjective.style.display = 'inline-block';
    p.innerHTML = str;

  }

}

