const Decimal = require('decimal.js')
const { CommonError } = require('@app/utils/errors')
const logger = require('@app/utils/logger')

function log(call, startTime, responseCode, error) {
  const duration = Decimal((process.hrtime.bigint() - startTime).toString())
    .div(1e9)
    .toFixed(6, Decimal.ROUND_DOWN)
  const paylod = {
    message: call.methodName,
    arguments: {
      request: call.request ? JSON.stringify(call.request) : '(stream)',
      responseCode
    },
    duration,
    error
  }
  switch (responseCode) {
    case 'COMM0000':
      return logger.debug(paylod)
    case 'COMM0101':
      return logger.warn(paylod)
    default:
      return logger.error(paylod)
  }
}

function logResponse(call, startTime, responseCode) {
  log(call, startTime, responseCode)
}

function logError(call, startTime, error) {
  const wrappedError = CommonError.wrapError(error)
  log(call, startTime, wrappedError.code, wrappedError)
}

module.exports = function logInterceptor(next) {
  return async (call, callback) => {
    const startTime = process.hrtime.bigint()
    try {
      switch (call.methodType) {
        case 'unary':
        case 'clientStream': {
          await next(call, (error, response) => {
            logResponse(call, startTime, response.code)
            callback(error, response)
          })
          break
        }
        case 'serverStream':
        case 'bidi': {
          await next(call)
          logResponse(call, startTime, 'COMM0000')
          break
        }
        default:
          throw new Error(`Unsupported gRPC method type ${call.methodType}`)
      }
    } catch (error) {
      logError(call, startTime, error)
      throw error
    }
  }
}
