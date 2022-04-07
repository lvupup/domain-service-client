const { loadProtos } = require('@app/utils/grpc')
const setting = require('@app/shared/setting')

module.exports = loadProtos({
  rootDir: setting.paths.protoDir,
  filename: setting.paths.protoGlob
})
