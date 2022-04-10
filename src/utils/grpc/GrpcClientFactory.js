const grpc = require('@grpc/grpc-js')

function createResponseAsync(callback) {
  let _resolve, _reject
  const promise = new Promise((resolve, reject) => {
    _resolve = resolve
    _reject = reject
  })
  promise.callback = (error, result) => {
    callback?.(error, result)
    error ? _reject(error) : _resolve(result)
  }
  return promise
}

function createWriteAllAsync(call) {
  return async function (messages) {
    for await (const message of messages) call.write(message)
    call.end()
  }
}

function decorateUnaryRequest(client, methodName) {
  const method = client[methodName].bind(client)
  client[methodName] = function (request, callback) {
    const responseAsync = createResponseAsync(callback)
    const call = method(request, responseAsync.callback)
    call.responseAsync = responseAsync
    return call
  }
}

function decorateClientStreamRequest(client, methodName) {
  const method = client[methodName].bind(client)
  client[methodName] = function (callback) {
    const responseAsync = createResponseAsync(callback)
    const call = method(responseAsync.callback)
    call.writeAllAsync = createWriteAllAsync(call)
    call.responseAsync = responseAsync
    return call
  }
}

function decorateBidiStreamRequest(client, methodName) {
  const method = client[methodName].bind(client)
  client[methodName] = function () {
    const call = method()
    call.writeAllAsync = createWriteAllAsync(call)
    return call
  }
}

function promisifyClient(client) {
  const methods = Object.entries(client.constructor.prototype)
  for (const [methodName, methodDef] of methods) {
    const { requestStream, responseStream } = methodDef
    switch (true) {
      case requestStream && responseStream:
        decorateBidiStreamRequest(client, methodName)
        break
      case requestStream && !responseStream:
        decorateClientStreamRequest(client, methodName)
        break
      case !requestStream && !responseStream:
        decorateUnaryRequest(client, methodName)
        break
    }
  }
  return client
}

module.exports = class GrpcClientFactory {
  #credentials = grpc.credentials.createInsecure()
  #channelOptions
  #channels = {}
  #clients = {}

  constructor(channelOptions) {
    this.#channelOptions = channelOptions
  }

  #getChannel(connectionString) {
    return (this.#channels[connectionString] ??= (() =>
      new grpc.Channel(
        connectionString,
        this.#credentials,
        this.#channelOptions
      ))())
  }

  getClient(connectionString, Service) {
    Service.serviceNamespace ??= (() => {
      const methodPath = Object.values(Service.service)[0].path
      return /^\/([^/]+)/.exec(methodPath)
    })()
    return (this.#clients[Service.serviceNamespace] ??= (() => {
      const channel = this.#getChannel(connectionString)
      const client = new Service(null, null, { channelOverride: channel })
      return promisifyClient(client)
    })())
  }
}
