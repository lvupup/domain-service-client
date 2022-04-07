const { ServingStatus } = require('@app/utils/grpc/health')

function check() {
  return { code: 'COMM0000', status: ServingStatus.Serving }
}

function* watch() {
  yield check()
}

module.exports = { check, watch }
