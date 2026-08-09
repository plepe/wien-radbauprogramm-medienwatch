const fs = require('fs')
const http = require('https')
const path = require('path')
const async = require('async')
const fields = require('./fields.json')
const config = require('../config.json')

module.exports = function downloadFiles (article, callback) {
  async.eachOf(fields, (def, key, done) => {
    if (!(key in article)) {
      return done()
    }

    value = article[key]
    if (!Array.isArray(value)) {
      value = [value]
    }

    if (def.type === 'image' || def.type === 'file') {
      return async.map(value, (v, done) => {
        const filename = path.basename(v.src)
        const localFilename = config.tmpDir + filename
        const writer = fs.createWriteStream(localFilename)
        writer.on('finish', () => {
          v.local = 'tmp/' + filename
          writer.close()
          done()
        })
        http.get(v.src, (response) => {
          response.pipe(writer)
        })
      }, done)
    }

    done()
  }, callback)
}
