const getSel = require('./getSel.js')
const getSelAttr = getSel.attr
const getSelText = getSel.text

module.exports = class NewspaperOTS {
  title () {
    return 'OTS'
  }

  matchUrlDocument ({url, document}) {
    if (url.match(/^https:\/\/(www\.|)ots\.at\//)) {
      return 10
    }
  }

  loadArticleFromDocument ({url, document}, node, callback) {
    const entry = {}

    const data = JSON.parse(getSelText(document, 'script[data-ots-jsonld]'))
    data['@graph'].forEach(e => {
      if (e['@type'] === 'Organization') {
        entry.medium = e.name
      }
      if (e['@type'] === 'NewsArticle') {
        entry.date = e.datePublished
        entry.url = e.url
        entry.title = e.headline
      }
    })

    entry.content = '<h1>' + entry.title + '</h1>'

    const lead = document.querySelector('article p.lead')
    entry.content += lead.outerHTML

    const content = document.querySelector('article div.content')
    entry.content += content.innerHTML

    callback(null, entry)
  }

  cleanUp (callback) {
    callback(null)
  }
}
