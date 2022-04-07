const grpc = require('@grpc/grpc-js')

function useInterceptorExtension(grpcServer) {
  const interceptors = []
  const baseRegister = grpcServer.register.bind(grpcServer)
  grpcServer.addInterceptor = interceptor => {
    if (grpcServer.handlers.size) {
      throw new Error('addInterceptor() should be invoke before addService().')
    }
    interceptors.push(interceptor)
  }
  grpcServer.register = (name, handler, serialize, deserialize, type) => {
    const baseInterceptor = next => (call, callback) => {
      call.methodName = name
      call.methodType = type
      next(call, callback)
    }
    const decoratedHandler = [baseInterceptor, ...interceptors].reduceRight(
      (next, interceptor) => interceptor(next),
      handler
    )
    return baseRegister(name, decoratedHandler, serialize, deserialize, type)
  }
}

function useListenExtension(grpcServer) {
  grpcServer.listenAsync = port =>
    new Promise((resolve, reject) =>
      grpcServer.bindAsync(
        `0.0.0.0:${port}`,
        grpc.ServerCredentials.createInsecure(),
        error => {
          if (error) return reject(error)
          grpcServer.start()
          resolve()
        }
      )
    )
}

module.exports = function createGrpcServer(options) {
  const grpcServer = new grpc.Server(options)
  useInterceptorExtension(grpcServer)
  useListenExtension(grpcServer)
  return grpcServer
}
