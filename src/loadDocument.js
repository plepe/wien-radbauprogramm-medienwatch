const jsdom = require('jsdom')
const { JSDOM } = jsdom
const config = require('../config.json')

module.exports = function loadDocument (url, callback) {
  const headers = new Headers()

  if (config.userAgent) {
    headers.append('User-Agent', config.userAgent)
  }

  fetch(url, { headers })
    .then(req => req.text())
    .then(body => {
      const dom = new JSDOM(body)
      const document = dom.window.document

      callback(null, document)
    })
}
