const get = require('lodash/get')
const { getConfig } = require('@app/utils/config')
const GrpcClientFactory = require('@app/utils/grpc/GrpcClientFactory')
const { HealthService } = require('@app/utils/grpc/health')

const ConnectionConfigKey = {
  Client: 'global.domainService.client'
}

let _clientFactory

function getClientFactory() {
  return (_clientFactory ??= (() => {
    const { enableCustomerSetting, ...channelOptions } =
      getConfig().global.grpcNetworkSetting.client
    return new GrpcClientFactory(enableCustomerSetting ? channelOptions : null)
  })())
}

function getClient(connectionConfigKey, Service) {
  const { hostName, port } = get(getConfig(), connectionConfigKey)
  return getClientFactory().getClient(`${hostName}:${port}`, Service)
}

module.exports = {
  getHealthServiceClient: () =>
    getClient(ConnectionConfigKey.Client, HealthService)
}
