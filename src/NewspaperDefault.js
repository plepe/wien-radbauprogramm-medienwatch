const getSel = require('./getSel.js')
const getSelAttr = getSel.attr
const getSelText = getSel.text

module.exports = class NewspaperDefault {
  title () {
    return ''
  }

  matchUrlDocument ({url, document}) {
    return 1
  }

  loadArticleFromDocument ({url, document}, node, callback) {
    const entry = {}

    entry.url = getSelAttr(document, 'link[rel=canonical]', 'href') ?? getSelAttr(document, 'meta[property="og:url"]', 'content')
    entry.title = getSelAttr(document, 'meta[property="og:title"]', 'content') ?? getSelText(document, 'title')
    entry.medium = getSelAttr(document, 'meta[property="og:site_name"]', 'content')
    entry.date = getSelAttr(document, 'meta[name="dc.date"]', 'content') ?? getSelAttr(document, 'meta[property="article:published_time"]', 'content')

    if (entry.medium && entry.title && entry.title.slice(-entry.medium.length - 3) === ' - ' + entry.medium) {
      entry.title = entry.title.slice(0, -entry.medium.length - 3)
    }

    const ldJsonSel = document.querySelector('script[type="application/ld+json"]')
    if (ldJsonSel) {
      const ldJson = JSON.parse(ldJsonSel.textContent)
      if (Array.isArray(ldJson['@graph'])) {
        const graph0 = ldJson['@graph'][0]
        if (!entry.date && graph0.datePublished) {
          entry.date = graph0.datePublished
        }
      }
      if (!entry.date && ldJson.datePublished) {
        entry.date = ldJson.datePublished
      }
      if (ldJson.headline) {
        entry.title = ldJson.headline
      }
    }

//    let dom
//    if (dom = document.querySelector('article')) {
//      entry.content = dom.innerHTML
//    }

    callback(null, entry)
  }

  cleanUp (callback) {
    callback(null)
  }
}
