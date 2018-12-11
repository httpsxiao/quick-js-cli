const request = require('./request')

module.exports = async (name, registryConf) => {
  let registry = registryConf || 'https://registry.npmjs.org'

  let result = 'latest'
  let info

  try {
    res = await request.get(`${registry}/${encodeURIComponent(name).replace(/^%40/, '@')}`)
    result = `^${res.body['dist-tags'].latest}`
  } catch (e) {
    result = 'latest'
  }

  return result
}
