const path = require('path')

const isDev = process.env.NODE_ENV === 'development'
const rootDir = path.join(__dirname, '../../')

module.exports = {
  consul: {
    protocol: process.env.Consul__Protocol || 'http',
    host: process.env.Consul__IP || 'localhost',
    port: process.env.Consul__Port || '8500',
    modules: 'Global,Client',
    override: isDev
      ? require(path.join(rootDir, 'config.development.json'))
      : null
  },
  paths: {
    rootDir,
    logDir: isDev ? path.join(rootDir, 'tmp/logs') : '/tmp/logs'
  }
}
