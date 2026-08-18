const getSel = require('./getSel.js')
const getSelAttr = getSel.attr

module.exports = class NewspaperBluesky {
  title () {
    return ''
  }

  matchUrlDocument ({url, document}) {
    if (url.match(/^https:\/\/bsky\.app\//)) {
      return 10
    }
  }

  loadArticleFromDocument ({url, document}, node, callback) {
    const entry = {}

    entry.url = getSelAttr(document, 'link[rel=canonical]', 'href')
    const ogTitle = getSelAttr(document, 'meta[property="og:title"]', 'content')
    const m = ogTitle.match(/^(.*) \(@.*\)/)
    entry.medium = m ? m[1] : ogTitle
    entry.title = getSelAttr(document, 'meta[name="description"]', 'content').split(/\n/)[0]
    entry.date = getSelAttr(document, 'meta[property="article:published_time"]', 'content')

    callback(null, entry)
  }

  cleanUp (callback) {
    callback(null)
  }
}
