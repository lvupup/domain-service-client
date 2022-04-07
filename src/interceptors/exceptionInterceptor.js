const { Metadata, status } = require('@grpc/grpc-js')
const { CommonError } = require('@app/utils/errors')

module.exports = function exceptionInterceptor(next) {
  return async (call, callback) => {
    switch (call.methodType) {
      case 'unary':
      case 'clientStream': {
        try {
          await next(call, callback)
        } catch (error) {
          const wrappedError = CommonError.wrapError(error)
          callback(null, { code: wrappedError.code })
        }
        return
      }
      case 'serverStream':
      case 'bidi': {
        try {
          await next(call)
        } catch (error) {
          const wrappedError = CommonError.wrapError(error)
          const metadata = new Metadata()
          metadata.set('code', wrappedError.code)
          call.emit('error', {
            code: status.INTERNAL,
            details: wrappedError.message,
            metadata
          })
        }
        return
      }
      default:
        throw new Error(`Unsupported gRPC method type ${call.methodType}`)
    }
  }
}
