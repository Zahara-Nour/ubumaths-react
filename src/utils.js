const loggers = {}
function getLogger(name, level = 'info') {
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

function isEmpty(obj) {
  return obj.constructor === Object && Object.entries(obj).length === 0
}
function getPropertyName(obj) {
  return Object.getOwnPropertyNames(obj)[0]
}

const lexicoSort = (a, b) => {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

export {getLogger, shuffle, isEmpty, getPropertyName, lexicoSort}