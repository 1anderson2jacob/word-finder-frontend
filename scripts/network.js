'use strict';

//export: queryDb, queryTwinWord
//import: 
import { displayWords, displayDefinition } from './display.js'
import { removeDefinitions } from './reset.js'

export function queryDb() {
  //used by bindButtons
  //uses: combineInputs, displayWords, removeDefinitions
  removeDefinitions();

  let queryUrl = combineInputs();

  async function getWords() {
    let res = await fetch('https://word-finder-backend.herokuapp.com/' + '?' + queryUrl);
    let data = await res.json();
    return data;
  }

  getWords().then(data => displayWords(data));
}

export function queryTwinWord(word) {
  //uses displayDefinition
  //used by displayWords
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

function combineInputs() {
  //used by queryDb
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