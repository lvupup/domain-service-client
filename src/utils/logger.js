const dayjs = require('dayjs')
const winston = require('winston')
const DailyRotateFile = require('winston-daily-rotate-file')
const { CommonError } = require('./errors')

let _rootDir = ''
let _logger

const logLevels = { error: 0, warn: 1, info: 2, debug: 3 }
const logTypes = { error: 'ERR', warn: 'WRN', info: 'INF', debug: 'DBG' }

function configure({ config, rootDir, logDir }) {
  const { enable, enableLogFile, logLevel } = config
  _rootDir = rootDir
  _logger = winston.createLogger({
    levels: logLevels,
    level: 'debug',
    format: winston.format.combine(
      filterLogByNamespace(logLevel),
      winston.format.printf(({ message }) => message)
    ),
    transports: createLogTransports({ enableLogFile, logDir }),
    exitOnError: false,
    silent: !enable
  })
}

function createLogTransports({ enableLogFile, logDir }) {
  return [
    new winston.transports.Console({ handleExceptions: true }),
    enableLogFile &&
      new DailyRotateFile({
        dirname: logDir,
        filename: 'All-%DATE%',
        extension: '.log',
        datePattern: 'YYYYMMDD',
        maxSize: '5m'
      })
  ].filter(Boolean)
}

function filterLogByNamespace({ default: defaultLevel, ...levelByNamespace }) {
  return winston.format(log => {
    let matchedNamespace
    for (const namespace in levelByNamespace) {
      const regex = new RegExp(`^${namespace.replace(/\./g, '.')}(.|$)`)
      const isMatch = regex.test(log.sender)
      if (!isMatch) continue
      if (namespace.length < (matchedNamespace?.length ?? 0)) continue
      matchedNamespace = namespace
    }
    const logPriority = logLevels[log.level]
    const matchedPriority =
      logLevels[levelByNamespace[matchedNamespace] ?? defaultLevel]
    return logPriority <= matchedPriority && log
  })()
}

function getLogSender() {
  const stackLine = new Error().stack.split('\n')[3]
  const stackReg = /at (?:(.+)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/
  const matches = stackReg.exec(stackLine)
  return (
    (matches?.length === 6 &&
      matches[2]
        .replace(`${_rootDir}`, '')
        .replace(/^node_modules\//, '')
        .replace(/\.js$/, '')
        .replace(/\//g, '.')) ||
    'unknown'
  )
}

function getLogParams(payload) {
  switch (true) {
    case typeof payload === 'string':
      return { message: payload }
    case payload instanceof CommonError:
      return { message: payload.message, error: payload }
    case payload == null:
      return {}
    default:
      return payload
  }
}

function formatLogMessage({ message, error }) {
  return message ?? error?.toString() ?? ''
}

function formatLogArguments({ arguments: args }) {
  if (args == null) return ''
  const kvPairs = Object.entries(args)
  if (!kvPairs.length) return ''
  return `\narguments:${kvPairs
    .map(([key, value]) => `${key}:${value}`)
    .join('|')}`
}

function formatLogDuration({ duration }) {
  return duration == null ? '' : `\nduration:${duration}`
}

function formatLogStackTrace({ error }) {
  return error?.stack == null ? '' : `\nstackTrace:${error.stack}`
}

function createLogFns() {
  return Object.keys(logLevels).reduce((fns, level) => {
    fns[level] = payload => {
      if (!_logger) {
        throw new Error(
          'Logger has not been set-up. Invoke `logger.configure()` before logging.'
        )
      }
      const date = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')
      const type = logTypes[level]
      const sender = getLogSender()
      const logParams = getLogParams(payload)
      const message =
        `${date} [${process.pid}][${type}][${sender}]` +
        formatLogMessage(logParams) +
        formatLogArguments(logParams) +
        formatLogDuration(logParams) +
        formatLogStackTrace(logParams)
      _logger[level]({ sender, message })
    }
    return fns
  }, {})
}

module.exports = { configure, ...createLogFns() }
