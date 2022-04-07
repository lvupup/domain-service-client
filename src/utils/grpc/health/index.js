const path = require('path')
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')

const pkgDef = protoLoader.loadSync(path.join(__dirname, 'Health.proto'))
const protos = grpc.loadPackageDefinition(pkgDef)

const ServingStatus = {
  Unknown: 0,
  Serving: 1,
  NotServing: 2,
  ServiceUnknown: 3
}

module.exports = {
  ServingStatus,
  HealthService: protos.grpc.health.v1.Health
}
