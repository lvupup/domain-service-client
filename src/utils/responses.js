class CommonResponse {
  static create(code, data) {
    return new CommonResponse(code, data)
  }

  static success(data) {
    return CommonResponse.create('COMM0000', data)
  }

  constructor(code, data) {
    this.code = code
    this.data = data
  }
}

module.exports = { CommonResponse }
