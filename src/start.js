require('dotenv').config()
require('module-alias/register')
const todoController = require('@app/controllers/todoController')
const actionInterceptor = require('@app/interceptors/actionInterceptor')
const exceptionInterceptor = require('@app/interceptors/exceptionInterceptor')
const logInterceptor = require('@app/interceptors/logInterceptor')
const setting = require('@app/shared/setting')
const { loadConfigAsync } = require('@app/utils/config')
const { CommonError } = require('@app/utils/errors')
const { loadProtosAsync, createGrpcServer } = require('@app/utils/grpc')
const logger = require('@app/utils/logger')

;(async function program() {
  const config = await loadConfigAsync(setting.consul)
  logger.configure({
    config: config.client.logging,
    rootDir: setting.paths.rootDir,
    logDir: setting.paths.logDir
  })
  try {
    const protos = await loadProtosAsync({
      rootDir: setting.paths.protoDir,
      filename: setting.paths.protoGlob
    })

    const grpcServer = createGrpcServer()
    grpcServer.addInterceptor(exceptionInterceptor)
    grpcServer.addInterceptor(logInterceptor)
    grpcServer.addInterceptor(actionInterceptor)
    grpcServer.addService(protos.Client.TodoService.service, todoController)
    await grpcServer.listenAsync(config.global.domainService.client.port)

    logger.info('application start')
  } catch (error) {
    logger.error(new CommonError('COMM9999', error))
  }
})()
