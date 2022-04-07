const path = require('path')
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const glob = require('glob')

module.exports = function loadProtos({ rootDir, filename }) {
  const opts = { longs: String, arrays: true, includeDirs: [rootDir] }
  const filenames = glob.sync(path.join(rootDir, filename))
  const pkgDef = protoLoader.loadSync(filenames, opts)
  return grpc.loadPackageDefinition(pkgDef)
}
