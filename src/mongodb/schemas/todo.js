const { Schema } = require('mongoose')

module.exports = new Schema({
  title: String,
  description: String,
  isCompleted: Boolean,
  items: [{ title: String, isCompleted: Boolean }],
  order: String,
  dateCreated: { type: Date, default: Date.now },
  dateUpdated: { type: Date, default: Date.now }
})
