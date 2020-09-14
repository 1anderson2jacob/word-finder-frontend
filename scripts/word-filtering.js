'use strict';

// exports:
// imports:

import { count, containsKeyValues } from './utility.js'

export function removeExtraWords(data) {
  //uses removeDupes
  //used by displayWords
  let letterPool = document.getElementById('letter-pool').value.toLowerCase();
  let wordsArr = [];
  let prunedWordsArr = [];
  let regex = new RegExp('\\b[' + letterPool + ']+\\b', 'i')

  for (let index of data) {
    wordsArr.push(index.word);
  }

  for (let i in wordsArr) {
    if (regex.test(wordsArr[i])) {
      prunedWordsArr.push(wordsArr[i]);
    }
  }

  prunedWordsArr = removeDupes(prunedWordsArr, letterPool);
  return prunedWordsArr;
}

function removeDupes(wordList, wordPool) {
  //uses: count, containsKeyValues
  //used by removeExtraWords
  let poolObj = {}
  let wordListObj = {};
  let arr = [];
  // push letterpool to an object
  poolObj = count(wordPool);

  for (let i = 0; i < wordList.length; i++) {
    // push prunedWordsList to an object
    wordListObj = count(wordList[i]);

    if (containsKeyValues(poolObj, wordListObj)) {
      arr.push(wordList[i]);
    }

  }

  return arr;
}