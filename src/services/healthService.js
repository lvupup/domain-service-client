const { ServingStatus } = require('@app/utils/grpc/health')
const { getHealthServiceClient } = require('@app/services/grpcClientFactory')

async function check() {
  const healthServiceClient = getHealthServiceClient()
  const result = await healthServiceClient.check({}).responseAsync
  if (result.status === ServingStatus.Serving) return
  throw new Error('gRPC service not serving.')
}

module.exports = {
  check
}
