module.exports = function actionInterceptor(next) {
  return async (call, callback) => {
    switch (call.methodType) {
      case 'unary': {
        callback(null, await next(call.request))
        return
      }
      case 'clientStream': {
        callback(null, await next(call))
        return
      }
      case 'serverStream': {
        for await (const chunk of next(call.request)) call.write(chunk)
        call.end()
        return
      }
      case 'bidi': {
        call.on('end', () => call.end())
        for await (const chunk of next(call)) call.write(chunk)
        return
      }
      default:
        throw new Error(`Unsupported gRPC method type ${call.methodType}`)
    }
  }
}
