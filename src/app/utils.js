
import moment from 'moment'


const loggers = {}
export function getLogger(name, level = 'info') {
  if (!loggers.hasOwnProperty(name) || loggers[name].level !== level) {
    const levels = ['trace', 'debug', 'info', 'warn', 'error']
    // const getTimestamp = () => ''
    // const getTimestamp = () => moment().format('YY-MM-DD HH:mm:ss')
    // const coloredPrefix = `%c[${getTimestamp()}] [${name}] `
    // const prefix = `[${getTimestamp()}] [${name}] `
    const coloredPrefix = `%c[${name}] `
    const prefix = `[${name}] `
    const noop = () => {}

    const error =
      levels.indexOf(level) <= levels.indexOf('error')
        ? console.error.bind(console, coloredPrefix, 'color:#ED8784')
        : noop
    const warn =
      levels.indexOf(level) <= levels.indexOf('warn')
        ? console.warn.bind(console, coloredPrefix, 'color:#F3D9A2')
        : noop
    const info =
      levels.indexOf(level) <= levels.indexOf('info')
        ? console.info.bind(console, coloredPrefix, 'color:#8CE9FF')
        : noop
    const debug =
      levels.indexOf(level) <= levels.indexOf('debug')
        ? console.log.bind(console, prefix)
        : noop
    const trace =
      levels.indexOf(level) <= levels.indexOf('trace')
        ? console.log.bind(console, prefix)
        : noop
    // logger.setLevel('TRACE')

    loggers[name] = {
      level,
      error,
      warn,
      info,
      debug,
      trace,
    }

    // console.log('new logger', name, loggers[name])
  }
  return loggers[name]
}
// console.log('console log')
// console.info('console info')
// console.warn('console warn')
// console.error('console error')
// const [error,warning,info, debug, trace] = getLogger("essai")
// trace("essai trace")
// debug("essai debug")
// info("essai info")
// warning("essai warning")
// error("essai error")

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

const compareArrays = (a, b) => {
  if (a.length !== b.length) return false
  return a.every((element, i) => element === b[i])
}

// const debug = require('debug')
// // const error = debug('ubumaths:error')
// // debug.error = console.error.bind(console)
// // const warning = debug('ubumaths:warning')
// // debug.warning = console.warn.bind(console) // don't forget to bind to console!
// const info = debug('ubumaths:info')
// // info.info = console.info.bind(console) // don't forget to bind to console!
// // const verbose = debug('ubumaths:verbose')
// // debug.verbose = console.log.bind(console) // don't forget to bind to console!
// // const log = debug('app:log')
// // debug.log = console.log.bind(console) // don't forget to bind to console!

// // debug.log('essi log')
// // debug.verbose('essi verbose')
// info('essi info')
// // debug.warning('essi warning')
// // debug.error('essi error')

export { shuffle, lexicoSort, compareArrays }
