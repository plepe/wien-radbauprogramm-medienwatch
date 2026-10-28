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
    entry.type = 'editorial'

    const main = document.querySelector('main.content, div[role=main].content')

    if (main) {
      entry.content = ''
      entry.images = []

      let dom
      if (dom = main.querySelector('h1')) {
        entry.content += dom.outerHTML
      }

      main.querySelectorAll('p, h2, ul').forEach(dom => {
        entry.content += dom.outerHTML
      })

      main.querySelectorAll('figure img').forEach(dom => {
        if (!dom.getAttribute('data-src') && !dom.getAttribute('srcset')) { return }

        const img = {
          src: dom.getAttribute('data-src') ?? dom.getAttribute('srcset').split(' ')[0],
          alt: dom.getAttribute('alt')
        }

        img.filename = path.basename(img.src).split('?')[0]

        entry.images.push(img)
      })
    }

    callback(null, entry)
  }

  cleanUp (callback) {
    callback(null)
  }
}
