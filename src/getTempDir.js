const fs = require('fs')
const config = require('../config.json')

module.exports = function getTempDir () {
  const tmpDir = Math.random().toString().split('.')[1]
  fs.mkdirSync(config.tmpDir + '/' + tmpDir)

  return [
    config.tmpDir + '/' + tmpDir + '/',
    tmpDir + '/'
  ]
}
