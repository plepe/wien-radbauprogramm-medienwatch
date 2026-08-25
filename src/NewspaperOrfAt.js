const path = require('path')
const getSel = require('./getSel.js')
const getSelAttr = getSel.attr
const getSelText = getSel.text

module.exports = class NewspaperDefault {
  title () {
    return ''
  }

  matchUrlDocument ({url, document}) {
    if (url.match(/^https:\/\/.*\.orf\.at\//)) {
      return 5
    }
  }

  loadArticleFromDocument ({url, document}, node, callback) {
    const entry = {}

    entry.url = getSelAttr(document, 'link[rel=canonical]', 'href')
    entry.title = getSelAttr(document, 'meta[property="og:title"]', 'content')
    entry.medium = getSelAttr(document, 'meta[property="og:site_name"]', 'content')
    entry.date = getSelAttr(document, 'meta[name="dc.date"]', 'content')
    entry.content = ''
    entry.type = 'editorial'
    entry.images = []

    let dom
    if (dom = document.querySelector('main.content h1')) {
      entry.content += dom.outerHTML
    }

    document.querySelectorAll('main.content p, main.content h2, main.content ul').forEach(dom => {
      entry.content += dom.outerHTML
    })

    document.querySelectorAll('main.content figure img').forEach(dom => {
      const img = {
        src: dom.getAttribute('data-src'),
        alt: dom.getAttribute('alt')
      }

      img.filename = path.basename(img.src).split('?')[0]

      entry.images.push(img)
    })

    callback(null, entry)
  }

  cleanUp (callback) {
    callback(null)
  }
}
