'use strict';

//import: queryTwinWord, removeExtraWords, removeList, removedefinitions
//export: displayWords, displayDefintions

import { queryTwinWord } from './network.js';
import { removeExtraWords } from './word-filtering.js';
import { removeList, removeDefinitions } from './reset.js'

export function displayWords(data) {
  //uses queryTwinWord, removeExtraWords, removeList
  //used by queryDB
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
}

export function displayDefinition(definitions) {
  //uses removeDefinitions
  //used by queryTwinWord
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
