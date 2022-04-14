const mongoose = require('mongoose')
const { getConfig } = require('@app/utils/config')
const logger = require('@app/utils/logger')
const todoSchema = require('./schemas/todo')

let _connection

function getConnection() {
  if (_connection != null) return _connection
  throw new Error(
    'MongoDB Connection has not been set-up. Invoke `mongo.setupConnection()` before connecting.'
  )
}

module.exports = {
  setupConnection() {
    const connectionString = getConfig().client.mongoDbConnection
    const options = { dbName: 'client' }
    _connection = mongoose.createConnection(connectionString, options)
    _connection.model('todo', todoSchema)
  },
  model(name) {
    return getConnection().model(name)
  },
  disconnectAsync() {
    return getConnection().close()
  }
}
