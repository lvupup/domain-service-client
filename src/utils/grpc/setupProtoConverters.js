const camelCase = require('lodash/camelCase')
const protobuf = require('protobufjs')

module.exports = function setupProtoConverters() {
  protobuf.util.camelCase = camelCase
  protobuf.wrappers['.google.protobuf.Timestamp'] = {
    fromObject(obj) {
      const date = new Date(obj)
      return this.create({
        seconds: Math.floor(date / 1000),
        nanos: (date % 1000) * 1000
      })
    },
    toObject(msg) {
      return new Date(msg.seconds * 1000 + msg.nanos / 1000)
    }
  }
}
