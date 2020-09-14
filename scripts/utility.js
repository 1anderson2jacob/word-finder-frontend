'use strict';

// exports:
// imports:

export function count(str) {
  //used by removeDupes
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

export function containsKeyValues(obj1, obj2) {
  //used by removeDupes

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