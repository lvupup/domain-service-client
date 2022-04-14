const http = require('http')
const util = require('util')
const { createTerminus } = require('@godaddy/terminus')
require('dotenv').config()
require('module-alias/register')
const todoController = require('@app/controllers/todoController')
const healthController = require('@app/controllers/healthController')
const actionInterceptor = require('@app/interceptors/actionInterceptor')
const exceptionInterceptor = require('@app/interceptors/exceptionInterceptor')
const logInterceptor = require('@app/interceptors/logInterceptor')
const mongoDb = require('@app/mongodb')
const healthService = require('@app/services/healthService')
const protos = require('@app/shared/protos')
const setting = require('@app/shared/setting')
const { initConfigAsync } = require('@app/utils/config')
const { CommonError } = require('@app/utils/errors')
const { createGrpcServer } = require('@app/utils/grpc')
const logger = require('@app/utils/logger')

;(async function program() {
  const config = await initConfigAsync(setting.consul)
  logger.configure({
    config: config.client.logging,
    rootDir: setting.paths.rootDir,
    logDir: setting.paths.logDir
  })
  try {
    mongoDb.setupConnection()

    const grpcServer = createGrpcServer()
    grpcServer.addInterceptor(exceptionInterceptor)
    grpcServer.addInterceptor(logInterceptor)
    grpcServer.addInterceptor(actionInterceptor)
    grpcServer.addHealthService(healthController)
    grpcServer.addService(protos.Client.TodoService.service, todoController)
    await grpcServer.listenAsync(config.global.domainService.client.port)

    const httpServer = http.createServer((_, res) => res.writeHead(404).end())
    createTerminus(httpServer, {
      healthChecks: { '/health': healthService.check },
      signals: ['SIGINT', 'SIGTERM'],
      beforeShutdown: async () => {
        await grpcServer.tryShutdownAsync()
        await mongoDb.disconnectAsync()
      },
      onShutdown: () => logger.info('application shutdown'),
      logger: (message, error) =>
        logger.error({ message, error: CommonError.wrapError(error) })
    })
    await util
      .promisify(httpServer.listen)
      .call(httpServer, config.global.domainService.client.port)

    logger.info('application start')
  } catch (error) {
    logger.error(new CommonError('COMM9999', error))
  }
})()
