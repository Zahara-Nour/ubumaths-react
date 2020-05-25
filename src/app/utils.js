/**
 * Randomly shuffle an array (in place shuffle)
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
const shuffle = function (array) {
  let currentIndex = array.length
  let temporaryValue, randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

const lexicoSort = (a, b) => {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}


const compareArrays = (a,b) => {
  if (a.length !== b.length) return false
  return a.every((element,i) => element===b[i])
}



const debug = require('debug');
const error = debug('ubumaths:error');
debug.error = console.error.bind(console);
const warning = debug('ubumaths:warning');
debug.warning = console.warn.bind(console); // don't forget to bind to console!
const info = debug('ubumaths:info');
debug.info = console.info.bind(console); // don't forget to bind to console!
const verbose = debug('ubumaths:verbose');
debug.verbose = console.log.bind(console); // don't forget to bind to console!
const log = debug('app:log');
debug.log = console.log.bind(console); // don't forget to bind to console!


export {shuffle, lexicoSort, compareArrays, error, warning, verbose, log, info}
