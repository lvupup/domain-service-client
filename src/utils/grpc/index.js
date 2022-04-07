const createGrpcServer = require('./createGrpcServer')
const setupProtoConverters = require('./setupProtoConverters')
const loadProtosAsync = require('./loadProtosAsync')

setupProtoConverters()

module.exports = { loadProtosAsync, createGrpcServer }
