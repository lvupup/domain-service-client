const j = require('joi')

const pKeyString = j.object({
  value: j.string().required()
})

module.exports = { pKeyString }
