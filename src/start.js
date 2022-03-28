require('dotenv').config()
require('module-alias/register')

const setting = require('@app/shared/setting')
const { initConfigAsync } = require('@app/utils/config')

;(async function program() {
  const config = await initConfigAsync(setting.consul)
  // eslint-disable-next-line no-console
  console.log(config)
})()
