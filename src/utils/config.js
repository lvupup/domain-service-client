const consul = require('consul')

let _config

function lowerFirstChar(string) {
  return string.replace(/^[A-Z]/, c => c.toLowerCase())
}

async function loadConfigAsync({ protocol, host, port, modules }) {
  const client = consul({
    host,
    port,
    secure: protocol === 'https',
    promisify: true
  })
  const keys = modules.split(',')
  const kvPairs = await Promise.all(keys.map(key => client.kv.get(key)))
  return (_config = kvPairs.reduce((config, kvPair) => {
    config[lowerFirstChar(kvPair.Key)] = JSON.parse(
      kvPair.Value,
      function (key, value) {
        if (!key) return value
        if (Array.isArray(this)) return value
        const newKey = lowerFirstChar(key)
        if (newKey === key) return value
        this[newKey] = value
      }
    )
    return config
  }, {}))
}

function getConfig() {
  if (_config) return _config
  throw new Error(
    'Config has not loaded. You should invoke `config.loadAsync()` before using.'
  )
}

module.exports = { loadConfigAsync, getConfig }
