const requestPromiseNative = require('request-promise-native')

module.exports = {
  get (uri) {
    const reqOpts = {
      method: 'GET',
      resolveWithFullResponse: true,
      json: true,
      uri
    }
    return requestPromiseNative(reqOpts)
  }
}
