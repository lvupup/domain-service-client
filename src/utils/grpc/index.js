const createGrpcServer = require('./createGrpcServer')
const setupProtoConverters = require('./setupProtoConverters')
const loadProtos = require('./loadProtos')

setupProtoConverters()

module.exports = { loadProtos, createGrpcServer }
