require('dotenv').config()
require('module-alias/register')

const setting = require('@app/shared/setting')
const { loadConfigAsync } = require('@app/utils/config')

;(async function program() {
  const config = await loadConfigAsync(setting.consul)
  // eslint-disable-next-line no-console
  console.log(config)
})()
