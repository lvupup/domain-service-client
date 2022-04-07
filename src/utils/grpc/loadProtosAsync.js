const path = require('path')
const util = require('util')
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const glob = util.promisify(require('glob'))

module.exports = async function loadProtosAsync({ rootDir, filename }) {
  const opts = { longs: String, includeDirs: [rootDir] }
  const filenames = await glob(path.join(rootDir, filename))
  const pkgDef = await protoLoader.load(filenames, opts)
  return grpc.loadPackageDefinition(pkgDef)
}
