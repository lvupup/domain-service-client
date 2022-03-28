const { statusMessages } = require('./statuses')

class CommonError extends Error {
  static wrapError(error) {
    if (error instanceof CommonError) return error
    return new CommonError('COMM9999', error)
  }

  constructor(code, error) {
    super()
    this.name = 'CommonError'
    this.code = statusMessages[code] ? code : 'COMM0208'
    this.message = `${this.code} : ${statusMessages[this.code]}`
    if (error?.stack != null) {
      const innerStackLines = [
        '--- Start of inner error stack trace ---',
        ...error.stack.split('\n'),
        '--- End of inner error stack trace ---'
      ]
      this.stack += `\n${innerStackLines
        .map(stackLine => `    ${stackLine}`)
        .join('\n')}`
    }
  }
}

module.exports = { CommonError }
