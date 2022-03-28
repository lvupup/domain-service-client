const consul = require('consul')
const isPlainObject = require('lodash/isPlainObject')
const lowerFirst = require('lodash/lowerFirst')
const merge = require('lodash/merge')

let _config

function lowerFirstKeys(object) {
  return Object.entries(object).reduce((result, [key, value]) => {
    result[lowerFirst(key)] = isPlainObject(value)
      ? lowerFirstKeys(value)
      : value
    return result
  }, {})
}

async function initConfigAsync({ protocol, host, port, modules, override }) {
  const client = consul({
    host,
    port,
    secure: protocol === 'https',
    promisify: true
  })
  const keys = modules.split(',')
  const kvPairs = await Promise.all(keys.map(key => client.kv.get(key)))
  let config = kvPairs.reduce((config, kvPair) => {
    config[kvPair.Key] = JSON.parse(kvPair.Value)
    return config
  }, {})
  config = merge(config, override)
  config = lowerFirstKeys(config)
  return (_config = config)
}

function getConfig() {
  if (_config) return _config
  throw new Error(
    'Config has not yet loaded. You should invoke `config.initConfigAsync()` before using.'
  )
}

module.exports = { initConfigAsync, getConfig }
