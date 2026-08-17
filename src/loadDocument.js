const jsdom = require('jsdom')
const { JSDOM } = jsdom

module.exports = function loadDocument (url, callback) {
  fetch(url)
    .then(req => req.text())
    .then(body => {
      const dom = new JSDOM(body)
      const document = dom.window.document

      callback(null, document)
    })
}
