require('dotenv').config()
require('module-alias/register')

const setting = require('@app/shared/setting')
const { initConfigAsync } = require('@app/utils/config')
const { CommonError } = require('@app/utils/errors')
const logger = require('@app/utils/logger')

;(async function program() {
  const config = await initConfigAsync(setting.consul)
  logger.configure({
    config: config.client.logging,
    rootDir: setting.paths.rootDir,
    logDir: setting.paths.logDir
  })
  try {
    logger.info('application start')
  } catch (error) {
    logger.error(new CommonError('COMM9999', error))
  } finally {
    logger.info('application stopped')
  }
})()
