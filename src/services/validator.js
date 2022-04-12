const { CommonError } = require('@app/utils/errors')

module.exports = {
  async validateAsync(schema, model) {
    try {
      await schema.validateAsync(model)
    } catch (error) {
      throw new CommonError('COMM0101', error)
    }
  }
}
